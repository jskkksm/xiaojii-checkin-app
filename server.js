const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");

const root = __dirname;
const port = Number(process.env.PORT) || 4173;
const dataDirectory = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(root, ".data");
const storeFile = path.join(dataDirectory, "teams.json");
const maxMembersPerTeam = 50;
const maxBodyBytes = 1024 * 1024;
const maxRawMediaBytes = 30 * 1024 * 1024;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

function emptyStore() {
  return { version: 1, teams: [] };
}

function loadStore() {
  try {
    if (!fs.existsSync(storeFile)) return emptyStore();
    const parsed = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    if (!parsed || !Array.isArray(parsed.teams)) return emptyStore();
    parsed.teams.forEach((team) => {
      (team.members || []).forEach((member) => {
        member.lastSeenAt = null;
      });
    });
    return parsed;
  } catch (error) {
    console.error("共享数据读取失败，已使用空数据。", error);
    return emptyStore();
  }
}

let store = loadStore();

function saveStore() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const temporary = `${storeFile}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(store), "utf8");
  fs.renameSync(temporary, storeFile);
}

function json(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBodyBytes) {
        reject(Object.assign(new Error("请求内容过大"), { status: 413 }));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error("请求格式不正确"), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function readBinary(request, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error("文件过大"), { status: 413 }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function tokenMatches(receivedToken, storedHash) {
  if (!receivedToken || !storedHash) return false;
  const receivedHash = Buffer.from(hashToken(receivedToken));
  const expectedHash = Buffer.from(storedHash);
  return receivedHash.length === expectedHash.length && crypto.timingSafeEqual(receivedHash, expectedHash);
}

function cleanName(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? String(value) : "";
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function startOfWeek(date) {
  const copy = new Date(date);
  const weekday = copy.getDay() || 7;
  copy.setDate(copy.getDate() - weekday + 1);
  return copy;
}

function findTeam(id) {
  return store.teams.find((team) => team.id === id);
}

function makeInviteCode() {
  let code = "";
  do {
    code = crypto.randomBytes(3).toString("hex").toUpperCase();
  } while (store.teams.some((team) => team.code === code));
  return code;
}

function addMember(team, name) {
  const token = createToken();
  const member = {
    id: crypto.randomUUID(),
    name,
    tokenHash: hashToken(token),
    joinedAt: new Date().toISOString()
  };
  team.members.push(member);
  return { member, token };
}

function publicMember(member, today, weekEntries) {
  const memberEntries = weekEntries.filter((entry) => entry.memberId === member.id);
  const todayCount = memberEntries.filter((entry) => entry.date === today && entry.complete).length;
  const weekPoints = memberEntries.filter((entry) => entry.complete).length * 10;
  return {
    id: member.id,
    name: member.name,
    joinedAt: member.joinedAt,
    todayCount,
    weekPoints,
    activeToday: todayCount > 0,
    status: member.status || "",
    signature: member.signature || "",
    online: Boolean(
      member.lastSeenAt && Date.now() - new Date(member.lastSeenAt).getTime() < 75_000
    )
  };
}

function sparkMembersOn(team, date) {
  return new Set(
    team.checkins
      .filter((entry) => entry.date === date && entry.complete)
      .map((entry) => entry.memberId)
  ).size;
}

function calculateSparkStreak(team, today) {
  let cursor = dateFromKey(today);
  if (sparkMembersOn(team, localDateKey(cursor)) < 2) cursor = addDays(cursor, -1);
  let streak = 0;
  for (let index = 0; index < 3660; index += 1) {
    if (sparkMembersOn(team, localDateKey(cursor)) < 2) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function teamSnapshot(team, query) {
  const today = cleanDate(query.get("today")) || localDateKey();
  const defaultStart = localDateKey(startOfWeek(dateFromKey(today)));
  const defaultEnd = localDateKey(addDays(dateFromKey(defaultStart), 6));
  const weekFrom = cleanDate(query.get("weekFrom")) || defaultStart;
  const weekTo = cleanDate(query.get("weekTo")) || defaultEnd;
  const weekEntries = team.checkins.filter((entry) => entry.date >= weekFrom && entry.date <= weekTo);
  const members = team.members
    .map((member) => publicMember(member, today, weekEntries))
    .sort(
      (first, second) =>
        second.todayCount - first.todayCount ||
        second.weekPoints - first.weekPoints ||
        first.joinedAt.localeCompare(second.joinedAt)
    );
  const memberNames = new Map(team.members.map((member) => [member.id, member.name]));
  const todayEntries = weekEntries.filter((entry) => entry.date === today && entry.complete);
  const recent = team.checkins
    .filter((entry) => entry.complete && entry.date >= weekFrom && entry.date <= weekTo)
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
    .slice(0, 20)
    .map((entry) => ({
      id: entry.id,
      memberId: entry.memberId,
      memberName: memberNames.get(entry.memberId) || "小组成员",
      habitId: entry.habitId,
      habitName: entry.habitName,
      icon: entry.icon,
      date: entry.date,
      value: entry.value,
      target: entry.target,
      unit: entry.unit,
      note: entry.note,
      updatedAt: entry.updatedAt
    }));
  const recentMessages = (Array.isArray(team.messages) ? team.messages : [])
    .filter((message) => !message.recipientId)
    .slice(-40)
    .map((message) => ({
      id: message.id,
      memberId: message.memberId,
      memberName: message.memberName || memberNames.get(message.memberId) || "小组成员",
      type: message.type,
      text: message.text,
      attachment: message.attachment || null,
      mediaUrl: message.mediaUrl || null,
      createdAt: message.createdAt
    }));

  return {
    team: {
      id: team.id,
      name: team.name,
      code: team.code,
      createdAt: team.createdAt,
      memberCount: team.members.length
    },
    today,
    weekFrom,
    weekTo,
    members,
    recent,
    recentMessages,
    spark: {
      days: calculateSparkStreak(team, today),
      todayMembers: sparkMembersOn(team, today)
    },
    totals: {
      todayCompleted: todayEntries.length,
      activeToday: members.filter((member) => member.activeToday).length,
      weekPoints: weekEntries.filter((entry) => entry.complete).length * 10
    }
  };
}

async function handleApi(request, response, url) {
  const { pathname, searchParams } = url;

  if (request.method === "GET" && pathname === "/api/health") {
    json(response, 200, { ok: true, teams: store.teams.length, time: new Date().toISOString() });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/teams") {
    const body = await readJson(request);
    const teamName = cleanName(body.teamName, 24);
    const memberName = cleanName(body.memberName, 12);
    if (!teamName || !memberName) {
      json(response, 400, { error: "请填写小组名称和你的称呼" });
      return true;
    }

    const team = {
      id: crypto.randomUUID(),
      code: makeInviteCode(),
      name: teamName,
      createdAt: new Date().toISOString(),
      members: [],
      checkins: [],
      messages: []
    };
    const { member, token } = addMember(team, memberName);
    store.teams.push(team);
    saveStore();
    json(response, 201, {
      team: { id: team.id, name: team.name, code: team.code, createdAt: team.createdAt },
      member: { id: member.id, name: member.name, token },
      snapshot: teamSnapshot(team, new URLSearchParams({ today: localDateKey() }))
    });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/teams/join") {
    const body = await readJson(request);
    const code = cleanName(body.code, 6).toUpperCase();
    const memberName = cleanName(body.memberName, 12);
    const team = store.teams.find((item) => item.code === code);
    if (!team) {
      json(response, 404, { error: "没有找到这个邀请码，请检查后重试" });
      return true;
    }
    if (!memberName) {
      json(response, 400, { error: "请填写你的称呼" });
      return true;
    }
    if (team.members.length >= maxMembersPerTeam) {
      json(response, 409, { error: "这个小组人数已满" });
      return true;
    }

    const { member, token } = addMember(team, memberName);
    saveStore();
    json(response, 201, {
      team: { id: team.id, name: team.name, code: team.code, createdAt: team.createdAt },
      member: { id: member.id, name: member.name, token },
      snapshot: teamSnapshot(team, new URLSearchParams({ today: localDateKey() }))
    });
    return true;
  }

  const messageMatch = pathname.match(/^\/api\/teams\/([^/]+)\/messages$/);
  if (messageMatch && request.method === "POST") {
    const team = findTeam(decodeURIComponent(messageMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const member = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!member) {
      json(response, 401, { error: "身份已失效" });
      return true;
    }
    const body = await readJson(request);
    const text = cleanName(body.text, 160);
    const attachment = String(body.attachment || "");
    const mediaUrl = String(body.mediaUrl || "");
    const requestedType = body.messageType === "image" ? "image" : "";
    const recipientId = cleanName(body.recipientId, 80);
    if (!text && !attachment) {
      json(response, 400, { error: "消息不能为空" });
      return true;
    }
    if (
      attachment &&
      (!/^data:image\/(?:jpeg|png|webp);base64,/i.test(attachment) ||
        attachment.length > 500_000)
    ) {
      json(response, 400, { error: "自定义表情文件过大或格式不支持" });
      return true;
    }
    if (mediaUrl && !/^\/api\/media\/[a-f0-9-]+\/[a-f0-9-]+\.(?:jpg|png|webp|mp4|webm)$/i.test(mediaUrl)) {
      json(response, 400, { error: "媒体地址不正确" });
      return true;
    }
    if (recipientId && !team.members.some((item) => item.id === recipientId)) {
      json(response, 400, { error: "对方已经不是小组成员" });
      return true;
    }
    if (recipientId === member.id) {
      json(response, 400, { error: "不能给自己发私聊消息" });
      return true;
    }
    const message = {
      id: crypto.randomUUID(),
      memberId: member.id,
      memberName: member.name,
      type: requestedType || (mediaUrl ? "video" : attachment ? "sticker" : "chat"),
      text: text || "表情",
      attachment: attachment || null,
      mediaUrl: mediaUrl || null,
      recipientId: recipientId || null,
      createdAt: new Date().toISOString()
    };
    team.messages ||= [];
    team.messages.push(message);
    team.messages = team.messages.slice(-400);
    saveStore();
    json(response, 201, { message });
    return true;
  }

  const mediaUploadMatch = pathname.match(/^\/api\/teams\/([^/]+)\/media$/);
  if (mediaUploadMatch && request.method === "POST") {
    const team = findTeam(decodeURIComponent(mediaUploadMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const member = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!member) {
      json(response, 401, { error: "身份已失效" });
      return true;
    }
    const mimeType = String(request.headers["content-type"] || "").split(";")[0].toLowerCase();
    const mediaTypes = {
      "image/jpeg": ["jpg", "image"],
      "image/png": ["png", "image"],
      "image/webp": ["webp", "image"],
      "video/mp4": ["mp4", "video"],
      "video/webm": ["webm", "video"]
    };
    const mediaConfig = mediaTypes[mimeType];
    if (!mediaConfig) {
      json(response, 415, { error: "不支持这种照片或视频格式" });
      return true;
    }
    const data = await readBinary(request, maxRawMediaBytes);
    if (!data.length) {
      json(response, 400, { error: "文件内容为空" });
      return true;
    }
    const teamDirectory = path.join(dataDirectory, "uploads", team.id);
    fs.mkdirSync(teamDirectory, { recursive: true });
    const filename = `${crypto.randomUUID()}.${mediaConfig[0]}`;
    fs.writeFileSync(path.join(teamDirectory, filename), data);
    json(response, 201, {
      mediaUrl: `/api/media/${team.id}/${filename}`,
      mediaType: mediaConfig[1],
      size: data.length
    });
    return true;
  }

  const mediaMatch = pathname.match(/^\/api\/media\/([a-f0-9-]+)\/([a-f0-9-]+\.(?:jpg|png|webp|mp4|webm))$/i);
  if (mediaMatch && request.method === "GET") {
    const teamId = mediaMatch[1];
    const filename = mediaMatch[2];
    const filePath = path.join(dataDirectory, "uploads", teamId, filename);
    if (!findTeam(teamId) || !fs.existsSync(filePath)) {
      json(response, 404, { error: "文件不存在" });
      return true;
    }
    const extension = path.extname(filename).slice(1).toLowerCase();
    const mimeTypes = {
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      mp4: "video/mp4",
      webm: "video/webm"
    };
    const stat = fs.statSync(filePath);
    const range = request.headers.range;
    response.setHeader("Accept-Ranges", "bytes");
    response.setHeader("Cache-Control", "private, max-age=86400");
    response.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match?.[1] ? Number(match[1]) : 0;
      const end = match?.[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (!match || start > end || start >= stat.size) {
        response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        response.end();
        return true;
      }
      response.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": end - start + 1
      });
      fs.createReadStream(filePath, { start, end }).pipe(response);
    } else {
      response.writeHead(200, { "Content-Length": stat.size });
      fs.createReadStream(filePath).pipe(response);
    }
    return true;
  }

  const editMessageMatch = pathname.match(/^\/api\/teams\/([^/]+)\/messages\/([^/]+)$/);
  if (editMessageMatch && request.method === "PATCH") {
    const team = findTeam(decodeURIComponent(editMessageMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const member = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!member) {
      json(response, 401, { error: "身份已失效" });
      return true;
    }
    const message = (team.messages || []).find(
      (item) => item.id === decodeURIComponent(editMessageMatch[2])
    );
    if (!message || message.memberId !== member.id) {
      json(response, 404, { error: "消息不存在或无权编辑" });
      return true;
    }
    if (message.type !== "chat") {
      json(response, 400, { error: "这条消息不能编辑" });
      return true;
    }
    const body = await readJson(request);
    const text = cleanName(body.text, 160);
    if (!text) {
      json(response, 400, { error: "请输入消息内容" });
      return true;
    }
    message.text = text;
    message.updatedAt = new Date().toISOString();
    saveStore();
    json(response, 200, { message });
    return true;
  }

  const directMatch = pathname.match(/^\/api\/teams\/([^/]+)\/direct\/([^/]+)$/);
  if (directMatch && request.method === "GET") {
    const team = findTeam(decodeURIComponent(directMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const currentMember = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!currentMember) {
      json(response, 401, { error: "身份已失效" });
      return true;
    }
    const targetId = decodeURIComponent(directMatch[2]);
    const target = team.members.find((item) => item.id === targetId);
    if (!target) {
      json(response, 404, { error: "这位同事已经离开小组" });
      return true;
    }
    const messages = (team.messages || [])
      .filter(
        (message) =>
          ["chat", "sticker", "image", "video"].includes(message.type) &&
          ((message.memberId === currentMember.id && message.recipientId === target.id) ||
            (message.memberId === target.id && message.recipientId === currentMember.id))
      )
      .slice(-80)
      .map((message) => ({
        id: message.id,
        memberId: message.memberId,
        memberName: message.memberName,
        type: message.type,
        text: message.text,
        attachment: message.attachment || null,
        mediaUrl: message.mediaUrl || null,
        recipientId: message.recipientId,
        createdAt: message.createdAt
      }));
    json(response, 200, {
      member: {
        id: target.id,
        name: target.name,
        online: Boolean(target.lastSeenAt && Date.now() - new Date(target.lastSeenAt).getTime() < 75_000)
      },
      messages
    });
    return true;
  }

  const memberProfileMatch = pathname.match(/^\/api\/teams\/([^/]+)\/members\/([^/]+)$/);
  if (memberProfileMatch && request.method === "GET") {
    const team = findTeam(decodeURIComponent(memberProfileMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const member = team.members.find(
      (item) => item.id === decodeURIComponent(memberProfileMatch[2])
    );
    if (!member) {
      json(response, 404, { error: "这位同事已经离开小组" });
      return true;
    }
    const today = cleanDate(searchParams.get("today")) || localDateKey();
    const weekFrom = cleanDate(searchParams.get("weekFrom")) || localDateKey(startOfWeek(dateFromKey(today)));
    const weekTo = cleanDate(searchParams.get("weekTo")) || localDateKey(addDays(dateFromKey(today), 6));
    const firstWeekday = dateFromKey(weekFrom);
    const lastWeekday = addDays(firstWeekday, 6);
    const weekEntries = team.checkins.filter(
      (entry) => entry.date >= localDateKey(firstWeekday) && entry.date <= localDateKey(lastWeekday)
    );
    const profile = publicMember(member, today, weekEntries);
    const history = team.checkins
      .filter((entry) => entry.memberId === member.id && entry.complete)
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
      .slice(0, 20)
      .map((entry) => ({
        id: entry.id,
        habitName: entry.habitName,
        icon: entry.icon,
        date: entry.date,
        value: entry.value,
        target: entry.target,
        unit: entry.unit,
        note: entry.note
      }));
    json(response, 200, { member: profile, history });
    return true;
  }

  const presenceMatch = pathname.match(/^\/api\/teams\/([^/]+)\/presence$/);
  if (presenceMatch && request.method === "POST") {
    const team = findTeam(decodeURIComponent(presenceMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const member = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!member) {
      json(response, 401, { error: "身份已失效" });
      return true;
    }
    const body = await readJson(request);
    const nextStatus = cleanName(body.status, 24);
    const nextSignature = cleanName(body.signature, 60);
    if (nextStatus && member.status !== nextStatus) {
      member.status = nextStatus;
      saveStore();
    }
    if (nextSignature && member.signature !== nextSignature) {
      member.signature = nextSignature;
      saveStore();
    }
    member.lastSeenAt = body.visible === false ? null : new Date().toISOString();
    json(response, 200, { ok: true, online: Boolean(member.lastSeenAt) });
    return true;
  }

  const checkinMatch = pathname.match(/^\/api\/teams\/([^/]+)\/checkins\/([^/]+)$/);
  if (checkinMatch && request.method === "PUT") {
    const team = findTeam(decodeURIComponent(checkinMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const member = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!member) {
      json(response, 401, { error: "身份已失效，请重新加入小组" });
      return true;
    }

    const body = await readJson(request);
    const habitId = cleanName(decodeURIComponent(checkinMatch[2]), 80);
    const habitName = cleanName(body.habitName, 20);
    const icon = cleanName(body.icon, 8) || "✨";
    const unit = cleanName(body.unit, 4) || "次";
    const note = cleanName(body.note, 60);
    const value = Math.min(Math.max(Number(body.value) || 0, 0), 9999);
    const target = Math.min(Math.max(Number(body.target) || 1, 1), 9999);
    const date = cleanDate(body.date);
    const earliestAllowed = localDateKey(addDays(new Date(), -31));
    const latestAllowed = localDateKey(addDays(new Date(), 1));
    if (!habitId || !habitName || !date || date < earliestAllowed || date > latestAllowed) {
      json(response, 400, { error: "打卡信息不完整" });
      return true;
    }

    const existingIndex = team.checkins.findIndex(
      (entry) => entry.memberId === member.id && entry.date === date && entry.habitId === habitId
    );
    let announceCompletion = false;
    if (value <= 0) {
      if (existingIndex >= 0) team.checkins.splice(existingIndex, 1);
    } else {
      const previousCheckin = existingIndex >= 0 ? team.checkins[existingIndex] : null;
      const checkin = {
        id: existingIndex >= 0 ? team.checkins[existingIndex].id : crypto.randomUUID(),
        memberId: member.id,
        habitId,
        habitName,
        icon,
        date,
        value,
        target,
        unit,
        note,
        complete: value >= target,
        updatedAt: new Date().toISOString()
      };
      announceCompletion = checkin.complete && !previousCheckin?.complete;
      if (existingIndex >= 0) team.checkins[existingIndex] = checkin;
      else team.checkins.push(checkin);
    }
    if (announceCompletion) {
      team.messages ||= [];
      team.messages.push({
        id: crypto.randomUUID(),
        memberId: member.id,
        memberName: member.name,
        type: "checkin",
        text: note ? `完成了「${habitName}」：${note}` : `完成了「${habitName}」`,
        createdAt: new Date().toISOString()
      });
      team.messages = team.messages.slice(-400);
    }
    saveStore();
    json(response, 202, { ok: true });
    return true;
  }

  const leaveMatch = pathname.match(/^\/api\/teams\/([^/]+)\/members\/me$/);
  if (leaveMatch && request.method === "DELETE") {
    const team = findTeam(decodeURIComponent(leaveMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    const authorization = request.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const member = team.members.find((item) => tokenMatches(token, item.tokenHash));
    if (!member) {
      json(response, 401, { error: "身份已失效" });
      return true;
    }
    team.members = team.members.filter((item) => item.id !== member.id);
    team.checkins = team.checkins.filter((item) => item.memberId !== member.id);
    if (!team.members.length) {
      store.teams = store.teams.filter((item) => item.id !== team.id);
    }
    saveStore();
    json(response, 200, { ok: true });
    return true;
  }

  const teamMatch = pathname.match(/^\/api\/teams\/([^/]+)$/);
  if (teamMatch && request.method === "GET") {
    const team = findTeam(decodeURIComponent(teamMatch[1]));
    if (!team) {
      json(response, 404, { error: "打卡小组不存在" });
      return true;
    }
    json(response, 200, teamSnapshot(team, searchParams));
    return true;
  }

  if (pathname.startsWith("/api/")) {
    json(response, 404, { error: "接口不存在" });
    return true;
  }
  return false;
}

function serveStatic(response, pathname) {
  const requestedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const firstSegment = requestedPath.split(/[\\/]/)[0];
  const filePath = path.resolve(root, requestedPath);
  const isPrivatePath = firstSegment.startsWith(".") || firstSegment === "server.js";

  if (
    isPrivatePath ||
    !filePath.startsWith(`${root}${path.sep}`) ||
    !fs.existsSync(filePath) ||
    fs.statSync(filePath).isDirectory()
  ) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("页面不存在");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff"
  });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  try {
    if (await handleApi(request, response, url)) return;
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD, POST, PUT" });
      response.end();
      return;
    }
    serveStatic(response, decodeURIComponent(url.pathname));
  } catch (error) {
    console.error(error);
    if (!response.headersSent) {
      json(response, error.status || 500, { error: error.status ? error.message : "服务器暂时开小差了" });
    } else {
      response.end();
    }
  }
});

server.listen(port, "0.0.0.0", () => {
  const addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => `http://${item.address}:${port}`);

  console.log(`\n小迹打卡已启动：http://localhost:${port}`);
  addresses.forEach((address) => console.log(`同一 Wi-Fi 下的手机可访问：${address}`));
  console.log(`共享数据目录：${dataDirectory}`);
  console.log("\n按 Ctrl+C 可停止服务。");
});
