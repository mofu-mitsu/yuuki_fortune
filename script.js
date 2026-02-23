// script.js

// 画面要素の取得
const yuukiVoice = document.getElementById("yuuki-voice");
const yuukiFace = document.getElementById("yuuki-face");
const menuArea = document.getElementById("menu-area");
const compMenu = document.getElementById("compatibility-menu");
const selectForm = document.getElementById("select-form");
const birthdayForm = document.getElementById("birthday-form");
const resultArea = document.getElementById("result-area");
const nameInput = document.getElementById("user-name");

// ⏳ 瞬き用のタイマー変数
let blinkInterval;

// 初期化
window.onload = function() {
    // 誕生日のプルダウン作成
    const monthSel = document.getElementById("birth-month");
    const daySel = document.getElementById("birth-day");
    if (monthSel && daySel) {
        for(let i=1; i<=12; i++) monthSel.innerHTML += `<option value="${i}">${i}月</option>`;
        for(let i=1; i<=31; i++) daySel.innerHTML += `<option value="${i}">${i}日</option>`;
    }
    
    // 瞬き開始！
    startBlinking();
};

// 👤 名前を取得
function getName() {
    let name = nameInput.value.trim();
    if (!name) name = "キミ";
    return name;
}

// 👀 【NEW】瞬き機能
function startBlinking() {
    // 重複防止のため一旦クリア
    clearInterval(blinkInterval);
    
    // 4秒ごとに瞬き
    blinkInterval = setInterval(() => {
        // メニューが表示されている時だけ瞬きする（結果画面では表情固定）
        if (menuArea.style.display !== "none") {
            const originalSrc = yuukiFace.src;
            
            // 目を閉じる（ニコ顔）
            yuukiFace.src = "images/yuuki_good.png";
            
            // 150ミリ秒後に目を開ける
            setTimeout(() => {
                // まだメニュー画面にいるなら戻す
                if (menuArea.style.display !== "none") {
                    yuukiFace.src = "images/yuuki.png";
                }
            }, 150);
        }
    }, 4000); // 4000ミリ秒 = 4秒間隔
}

// 🛑 瞬き停止（結果画面に行くとき用）
function stopBlinking() {
    clearInterval(blinkInterval);
}


// 🎲 日替わり固定ランダム関数
function getDailyRandom(uniqueKeyword) {
    const today = new Date();
    const dateStr = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    const seedString = dateStr + uniqueKeyword + getName();
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = (hash * 31 + seedString.charCodeAt(i)) % 1000000007;
    }
    return (hash % 1000) / 1000;
}


// 🔄 リセット（ホームに戻る）
function resetScreen() {
    menuArea.style.display = "block";
    compMenu.classList.add("hidden");
    selectForm.classList.add("hidden");
    birthdayForm.classList.add("hidden");
    resultArea.classList.add("hidden");
    resultArea.innerHTML = "";
    
    yuukiFace.src = "images/yuuki.png";
    yuukiVoice.innerHTML = `「おかえり、${getName()}。<br>次はどうする？」`;
    
    // ホームに戻ったので瞬き再開
    startBlinking();
}


// ---------------------------------------------------
// 🔮 1. 今日の運勢（タロット）
// ---------------------------------------------------
function startDailyFortune() {
    stopBlinking(); // 瞬き停止
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();

    yuukiVoice.innerHTML = `「${userName}の今日の運勢ね？<br>バシッと占ってあげるよ！」`;
    yuukiFace.src = "images/yuuki.png";
    resultArea.innerHTML = `<p>運命のカードを選出中...</p>`;

    setTimeout(() => {
        const rand = getDailyRandom("tarot");
        const cardIndex = Math.floor(rand * tarotDeck.length);
        const card = tarotDeck[cardIndex];
        const comment = card.yuukiComment.replace(/{user}/g, userName);

        resultArea.innerHTML = `
            <h2>📅 今日の運勢結果</h2>
            <div id="card-display">
                ${card.image ? `<img src="${card.image}" style="max-width:100%; border-radius:10px;">` : `<div class="temp-card">🃏</div>`}
            </div>
            <h3>${card.name}</h3>
            <p>${card.meaning}</p>
            <div class="yuuki-comment-box">
                <span class="label">ゆうき</span>
                <p>「${comment}」</p>
            </div>
            ${card.recommendLink ? `<a href="${card.recommendLink}" target="_blank" class="link-btn"><i class="fa-solid fa-gamepad"></i> ${card.recommendText}</a>` : ''}
            
            <button onclick="shareResult('【今日の運勢】${card.name}！ゆうき「${comment}」 #ゆうきの気まぐれ占い')" class="menu-btn share-btn">
                <i class="fa-solid fa-share-nodes"></i> 今日の結果をシェア
            </button>
            <button onclick="resetScreen()" class="retry-btn">戻る</button>
        `;
        updateYuukiFace(card.resultType);
    }, 1500);
}


// ---------------------------------------------------
// 🔮 2. 今、この瞬間の運勢（水晶玉）
// ---------------------------------------------------
function startRandomFortune() {
    stopBlinking(); // 瞬き停止
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();

    yuukiVoice.innerHTML = `「おっ、${userName}。<br>水晶玉で少し先の未来…<br>覗いてみる？」`;
    yuukiFace.src = "images/yuuki.png";

    resultArea.innerHTML = `
        <h2>🔮 水晶玉の啓示</h2>
        <div class="crystal-ball-container"><div class="crystal-ball"></div></div>
        <p>精神を統一して…ハッ！</p>
    `;

    setTimeout(() => {
        const msg = crystalMessages[Math.floor(Math.random() * crystalMessages.length)];
        const item = luckyItems[Math.floor(Math.random() * luckyItems.length)];
        const color = luckyColors[Math.floor(Math.random() * luckyColors.length)];

        resultArea.innerHTML = `
            <h2>🔮 水晶玉の啓示</h2>
            <div class="crystal-ball-container">
                <div class="crystal-ball">
                    <div class="crystal-text" style="opacity:1; animation: fadeIn 2s;">${msg}</div>
                </div>
            </div>
            <div class="yuuki-comment-box"><span class="label">水晶のお告げ</span><p>「${msg}」</p></div>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <div class="lucky-box" style="flex:1;"><span class="lucky-label">🍀 ラッキーアイテム</span><div class="lucky-content">${item}</div></div>
                <div class="lucky-box" style="flex:1;"><span class="lucky-label">🎨 ラッキーカラー</span><div class="lucky-content">${color}</div></div>
            </div>
            <div style="margin-top:15px;">
                <button onclick="startRandomFortune()" class="menu-btn" style="background: linear-gradient(90deg, #43e97b, #38f9d7); color:#333;"><i class="fa-solid fa-rotate"></i> もう一回覗く</button>
                <button onclick="shareResult('今のラッキーアイテムは【${item}】！水晶のお告げ「${msg}」 #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> 結果をシェア</button>
                <button onclick="resetScreen()" class="retry-btn">トップに戻る</button>
            </div>
        `;
        yuukiFace.src = "images/yuuki.png"; 
    }, 1000);
}


// ---------------------------------------------------
// 📊 3. 項目別運勢
// ---------------------------------------------------
function startCategoryFortune() {
    stopBlinking();
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();
    
    yuukiVoice.innerHTML = `「${userName}の今日のステータスは<br>こんな感じかな〜」`;

    const love = Math.floor(getDailyRandom("love") * 101);
    const work = Math.floor(getDailyRandom("work") * 101);
    const money = Math.floor(getDailyRandom("money") * 101);
    const human = Math.floor(getDailyRandom("human") * 101);

    let totalComment = "ま、平凡が一番平和ってことよ。";
    if (love > 80 && work > 80) totalComment = "うっわ、最強じゃん！今日何しても上手くいきそう！";
    else if (work > 90) totalComment = "創作の神が降りてきてる！今すぐ何か書きなよ！";
    else if (money > 90) totalComment = "金運やば！奢ってよ（笑）";
    else if (love < 20 && human < 20) totalComment = "…今日は家で大人しく寝とこう。ね？";

    resultArea.innerHTML = `
        <h2>📊 今日のステータス</h2>
        <div class="meter-box"><div class="meter-label">💘 恋愛運: ${love}%</div><div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${love}%"></div></div></div>
        <div class="meter-box"><div class="meter-label">🎨 創作/勉強: ${work}%</div><div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${work}%"></div></div></div>
        <div class="meter-box"><div class="meter-label">💰 金運: ${money}%</div><div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${money}%"></div></div></div>
        <div class="meter-box"><div class="meter-label">🤝 対人運: ${human}%</div><div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${human}%"></div></div></div>
        <div class="yuuki-comment-box"><span class="label">ゆうき</span><p>「${totalComment}」</p></div>
        <button onclick="shareResult('【${userName}の運勢】恋愛${love}% 創作${work}% 金運${money}%！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> シェア</button>
        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;
}


// ---------------------------------------------------
// 🎂 4. 誕生日・星座占い
// ---------------------------------------------------
function showBirthdayForm() {
    menuArea.style.display = "none";
    birthdayForm.classList.remove("hidden");
    yuukiVoice.innerHTML = "「誕生日教えて？<br>星の動きを見てあげる！」";
}

function startBirthdayFortune() {
    const month = document.getElementById("birth-month").value;
    const day = document.getElementById("birth-day").value;
    
    if(!month || !day) {
        alert("月と日を選んでよ〜");
        return;
    }
    stopBlinking();

    birthdayForm.classList.add("hidden");
    resultArea.classList.remove("hidden");
    const userName = getName();
    const zodiac = getZodiac(parseInt(month), parseInt(day));
    const luckScore = Math.floor(getDailyRandom("zodiac" + month + day) * 100);
    
    let msg = "";
    if(luckScore > 80) msg = "星が味方してる！願い事叶うかもよ？";
    else if(luckScore > 50) msg = "可もなく不可もなく。いつも通りが一番！";
    else msg = "ちょっと星の巡りが乱れてるかも。深呼吸してリラックスして。";

    resultArea.innerHTML = `
        <h2>⭐ 星座占い結果</h2>
        <div style="font-size:3rem;">✨</div>
        <h3>${zodiac}の${userName}へ</h3>
        <p style="font-size:1.5rem; color:#ffd700; font-weight:bold;">今日の運勢指数: ${luckScore}</p>
        <div class="yuuki-comment-box"><span class="label">ゆうき</span><p>「${msg}」</p></div>
        <button onclick="shareResult('${userName}(${zodiac})の今日の運勢は${luckScore}！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> シェア</button>
        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;
}
function getZodiac(m, d) {
    const dates = [20,19,21,20,21,22,23,23,23,24,22,22];
    const signs = ["山羊座","水瓶座","魚座","牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座","天秤座","蠍座","射手座","山羊座"];
    return signs[m - (d < dates[m-1] ? 1 : 0)];
}


// ---------------------------------------------------
// ❤️ 5. クラス相性（全キャラ画像変動対応！）
// ---------------------------------------------------
function startCompatibilityMenu() {
    menuArea.style.display = "none";
    selectForm.classList.add("hidden");
    resultArea.classList.add("hidden");
    compMenu.classList.remove("hidden");
    yuukiVoice.innerHTML = `「${getName()}、誰との相性が知りたい？」`;
}

// 今日のNo.1
function startDailyBestMatch() {
    stopBlinking();
    compMenu.classList.add("hidden");
    resultArea.classList.remove("hidden");

    if (!classmates || classmates.length === 0) return;

    const rand = getDailyRandom("bestmatch"); 
    const bestIndex = Math.floor(rand * classmates.length);
    const bestPartner = classmates[bestIndex];
    const score = 90 + Math.floor(getDailyRandom("bestscore") * 11); 

    showCompResult(bestPartner, score, "best");
}

// 指名占い準備
function showSelectForm() {
    compMenu.classList.add("hidden");
    selectForm.classList.remove("hidden");
}

function updateMemberSelect() {
    const classVal = document.getElementById("class-select").value;
    const memberSelect = document.getElementById("member-select");
    memberSelect.innerHTML = "<option value=''>誰にする？</option>";

    const members = classmates.filter(c => c.class === classVal);
    members.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = m.name;
        memberSelect.appendChild(option);
    });
}

function calculateSpecificCompatibility() {
    const targetId = document.getElementById("member-select").value;
    if (!targetId) {
        alert("誰か選んでよ〜！");
        return;
    }
    stopBlinking();
    
    const partner = classmates.find(c => c.id === targetId);
    const rand = getDailyRandom("comp" + partner.id);
    const score = Math.floor(rand * 101); 
    
    let rank = "bad";
    if (score >= 90) rank = "best";
    else if (score >= 70) rank = "good";
    else if (score >= 40) rank = "normal";

    selectForm.classList.add("hidden");
    resultArea.classList.remove("hidden");
    
    showCompResult(partner, score, rank);
}


// 【重要】相性結果表示（全キャラ表情変動ロジック入り）
function showCompResult(partner, score, rank) {
    const userName = getName();
    const types = partner.types || { mbti: "?", enneagram: "?", socio: "?" };
    const color = partner.color || "#ccc";

    let rawPartnerComment = partner.comments ? partner.comments[rank] : "…（じっと見ている）";
    let partnerComment = rawPartnerComment.replace(/{user}/g, userName);

    let yuukiComment = "";
    if (rank === "best") yuukiComment = `すっげ！${userName}と相性バッチリじゃん！運命？`;
    else if (rank === "good") yuukiComment = "おー、かなりいい感じ！仲良くなれるよ。";
    else if (rank === "normal") yuukiComment = "ま、普通が一番平和ってことよ。";
    else yuukiComment = "…ま、まあドンマイ！明日があるさ！";

    // 🖼️ 画像切り替えロジック
    // momoka.png, momoka_good.png, momoka_bad.png を使い分ける
    let suffix = "";
    if (rank === "best" || rank === "good") {
        suffix = "_good"; // 良い結果なら笑顔
    } else if (rank === "bad") {
        suffix = "_bad"; // 悪い結果なら困り顔
    }
    
    // 画像パス作成
    let partnerImgSrc = `images/${partner.id}${suffix}.png`;

    resultArea.innerHTML = `
        <h2 style="color:${color}">❤️ 相性診断結果</h2>
        
        <div class="partner-img">
            <!-- onerrorで、_goodや_badが無くても通常の画像を表示させる安全装置 -->
            <img src="${partnerImgSrc}" 
                 onerror="this.src='images/${partner.id}.png'; this.onerror=null;" 
                 style="border-color:${color}">
        </div>
        
        <h3>${partner.fullname} <span style="font-size:0.8em">(${partner.class})</span></h3>
        <div class="profile-info" style="border-left: 4px solid ${color}">
            <div><span class="profile-tag">${types.mbti}</span><span class="profile-tag">${types.enneagram}</span><span class="profile-tag">${partner.motif || ""}</span></div>
            <p class="bio-text">${partner.bio || ""}</p>
        </div>
        <div class="score-box">相性度：<span class="score-num">${score}%</span></div>
        <div class="dialogue-box partner-voice" style="border-left: 5px solid ${color}">
            <span class="label">${partner.name}</span><p>「${partnerComment}」</p>
        </div>
        <div class="yuuki-comment-box"><span class="label">ゆうき</span><p>「${yuukiComment}」</p></div>
        <button onclick="shareResult('${partner.name}と${userName}の相性は${score}%！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> シェア</button>
        <button onclick="startCompatibilityMenu()" class="retry-btn">他の子も占う</button>
        <button onclick="resetScreen()" class="retry-btn">トップに戻る</button>
    `;
    
    // ゆうきの表情も結果に合わせる
    updateYuukiFace(rank);
}


// ---------------------------------------------------
// 🌙 6. 深読みモード
// ---------------------------------------------------
const shadowKeywords = [
    // --- 既存 ---
    "孤独", "渇望", "解放", "沈黙", "覚醒", "依存", "虚無", "追憶", "衝動", "浄化",

    // --- 新規追加 ---
    "哀愁", "乖離", "予感", "欠落", "潜伏", "境界", "矛盾", 
    "回帰", "偽り", "祈り", "崩壊", "迷宮", "残響", "逃避", 
    "変容", "深淵", "秘密", "共鳴", "刹那", "再生"
];
const midnightMissions = [
    // --- 既存 ---
    "窓を少しだけ開けて、夜の匂いを嗅いでみて。", 
    "スマホの画面を伏せて、1分間目を閉じて。", 
    "誰も見ていないから、変な顔をしてみて。",
    "冷たい水を一杯だけ飲んで、体内を冷まして。", 
    "嫌だった記憶を紙に書いて、ビリビリに破いて。", 
    "お気に入りの曲を、最小の音量で聴いて。",
    "鏡の中の自分と、3秒だけ目を合わせて。",

    // --- 新規追加 ---
    "自分の脈を測って、生きているリズムを感じて。",
    "部屋の電気を消して、月明かり（または街灯）を探して。",
    "枕に顔をうずめて、一度だけ音にならない叫び声をあげて。",
    "自分の手のひらをじっと見つめて、手相をなぞってみて。",
    "一番古い写真フォルダを見返して、その時の空気を感じて。",
    "深呼吸をして、吸う息より吐く息を長くしてみて。",
    "布団の中で、誰にも言えない秘密を一つだけ呟いて。",
    "壁や床の冷たさを、指先で確かめて。",
    "目を閉じて、一番行きたい場所を具体的に想像して。",
    "自分自身を、自分でぎゅっと抱きしめてあげて。"
];

function startDeepReading() {
    const hour = new Date().getHours();
    if (hour < 21 && hour > 4) {
        alert("ゆうき「ん〜、まだ外明るくない？\nこういうのは夜の方が雰囲気出るんだよね〜（21時以降においで）」");
        return;
    }
    stopBlinking(); // 瞬き停止

    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();
    yuukiFace.src = "images/yuuki_bad.png"; 
    yuukiVoice.innerHTML = `「…ようこそ、${userName}。<br>心の奥底にある青い炎…<br>一緒に見つめてみようか。」`;

    resultArea.innerHTML = `
        <h2>🌙 深層心理の儀式</h2>
        <div class="soul-flame-container"><div class="soul-flame"></div></div>
        <p style="font-size:0.9rem; opacity:0.8;">炎を見つめて、心を空っぽにして…</p>
    `;

    setTimeout(() => {
        const thoughts = (typeof nightThoughts !== 'undefined') ? nightThoughts : ["君、本当は無理してない？", "夜は素直になれる時間だよ。"];
        const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)].replace(/{user}/g, userName);
        const keyword = shadowKeywords[Math.floor(Math.random() * shadowKeywords.length)];
        const mission = midnightMissions[Math.floor(Math.random() * midnightMissions.length)];

        resultArea.innerHTML = `
            <h2>🌙 深層心理の結果</h2>
            <div class="soul-flame-container"><div class="soul-flame"></div></div>
            <div style="text-align:center;"><p style="font-size:0.8rem; color:#aaa; margin-bottom:0;">今の君を表す言葉</p><div class="shadow-keyword">${keyword}</div></div>
            <div style="background:#000; padding:20px; border-radius:10px; color:#b197fc; border:1px solid #4a2b6b; margin-top:10px;">
                <p style="font-size:1.1em; font-family:'Zen Maru Gothic'">「…ねえ、${userName}。<br>${randomThought}」</p>
            </div>
            <div class="mission-box"><span class="mission-label">MIDNIGHT MISSION</span><i class="fa-solid fa-candle-holder"></i> ${mission}</div>
            <button onclick="shareResult('夜の深層心理…キーワードは『${keyword}』。ゆうき「${randomThought}」 #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> 静かにシェアする</button>
            <button onclick="resetScreen()" class="retry-btn">朝の世界へ戻る</button>
        `;
    }, 2500);
}


// ---------------------------------------------------
// 📡 共通機能
// ---------------------------------------------------
function updateYuukiFace(type) {
    if (type === "best" || type === "good") yuukiFace.src = "images/yuuki_good.png"; 
    else if (type === "bad") yuukiFace.src = "images/yuuki_bad.png"; 
    else yuukiFace.src = "images/yuuki.png"; 
}

function shareResult(text) {
    if (navigator.share) {
        navigator.share({ title: 'ゆうきの気まぐれ猫占い🔮', text: text, url: window.location.href })
        .catch((e) => console.log('シェアキャンセル', e));
    } else {
        alert("シェア内容をコピーしたよ！\n\n" + text);
    }
}
