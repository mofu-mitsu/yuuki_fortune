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

// 初期化：誕生日のプルダウンを作る
window.onload = function() {
    const monthSel = document.getElementById("birth-month");
    const daySel = document.getElementById("birth-day");
    for(let i=1; i<=12; i++) monthSel.innerHTML += `<option value="${i}">${i}月</option>`;
    for(let i=1; i<=31; i++) daySel.innerHTML += `<option value="${i}">${i}日</option>`;
};

// 👤 名前を取得
function getName() {
    let name = nameInput.value.trim();
    if (!name) name = "キミ";
    return name;
}

// 🎲 【重要】日替わり固定ランダム関数
// seedString（名前や日付）が変わらない限り、同じ結果を返す魔法
function getDailyRandom(uniqueKeyword) {
    const today = new Date();
    // 日付文字列 (例: 20240218)
    const dateStr = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    
    // シード文字列を作る（日付 + 入力されたキーワード + 名前）
    const seedString = dateStr + uniqueKeyword + getName();
    
    // 文字列を数字に変換（ハッシュ化）
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = (hash * 31 + seedString.charCodeAt(i)) % 1000000007;
    }
    
    // 0〜1の小数を返す
    return (hash % 1000) / 1000;
}


// 🔄 リセット
function resetScreen() {
    menuArea.style.display = "block";
    compMenu.classList.add("hidden");
    selectForm.classList.add("hidden");
    birthdayForm.classList.add("hidden");
    resultArea.classList.add("hidden");
    resultArea.innerHTML = "";
    
    yuukiFace.src = "images/yuuki.png";
    yuukiVoice.innerHTML = `「おかえり、${getName()}。<br>次はどうする？」`;
}


// ---------------------------------------------------
// 🔮 1. 今日の運勢（タロット）
// ➡ 【修正】日替わり固定にしたよ！
// ---------------------------------------------------
function startDailyFortune() {
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();

    yuukiVoice.innerHTML = `「${userName}の今日の運勢ね？<br>バシッと占ってあげるよ！」`;
    yuukiFace.src = "images/yuuki.png";

    // ローディング
    resultArea.innerHTML = `<p>運命のカードを選出中...</p>`;

    setTimeout(() => {
        // 🎲 ここを「日替わり固定」に変更！
        // "tarot" というキーワードで固定する
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
    }, 1500); // じっくり1.5秒待つ
}


// ---------------------------------------------------
// 🔮 2. 今、この瞬間の運勢（水晶玉占い）
// ➡ 完全ランダム！ラッキーアイテムが出るよ！
// ---------------------------------------------------
function startRandomFortune() {
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();

    yuukiVoice.innerHTML = `「おっ、${userName}。<br>水晶玉で少し先の未来…<br>覗いてみる？」`;
    yuukiFace.src = "images/yuuki.png";

    // 演出：水晶玉を表示（まだ文字は出さない）
    resultArea.innerHTML = `
        <h2>🔮 水晶玉の啓示</h2>
        <div class="crystal-ball-container">
            <div class="crystal-ball"></div>
        </div>
        <p>精神を統一して…ハッ！</p>
    `;

    // 1秒後に結果を表示
    setTimeout(() => {
        // ランダムに選ぶ
        const msg = crystalMessages[Math.floor(Math.random() * crystalMessages.length)];
        const item = luckyItems[Math.floor(Math.random() * luckyItems.length)];
        const color = luckyColors[Math.floor(Math.random() * luckyColors.length)];

        // 結果画面の更新
        resultArea.innerHTML = `
            <h2>🔮 水晶玉の啓示</h2>
            
            <div class="crystal-ball-container">
                <div class="crystal-ball">
                    <!-- 水晶の中に文字を浮かべる演出 -->
                    <div class="crystal-text" style="opacity:1; animation: fadeIn 2s;">${msg}</div>
                </div>
            </div>

            <div class="yuuki-comment-box">
                <span class="label">水晶のお告げ</span>
                <p>「${msg}」</p>
            </div>

            <div style="display:flex; gap:10px; margin-top:10px;">
                <div class="lucky-box" style="flex:1;">
                    <span class="lucky-label">🍀 ラッキーアイテム</span>
                    <div class="lucky-content">${item}</div>
                </div>
                <div class="lucky-box" style="flex:1;">
                    <span class="lucky-label">🎨 ラッキーカラー</span>
                    <div class="lucky-content">${color}</div>
                </div>
            </div>
            
            <div style="margin-top:15px;">
                <button onclick="startRandomFortune()" class="menu-btn" style="background: linear-gradient(90deg, #43e97b, #38f9d7); color:#333;">
                    <i class="fa-solid fa-rotate"></i> もう一回覗く
                </button>
                <button onclick="shareResult('今のラッキーアイテムは【${item}】！水晶のお告げ「${msg}」 #ゆうきの気まぐれ占い')" class="menu-btn share-btn">
                    <i class="fa-solid fa-share-nodes"></i> 結果をシェア
                </button>
                <button onclick="resetScreen()" class="retry-btn">トップに戻る</button>
            </div>
        `;
        
        // ゆうきの顔をランダムで変える（水晶の結果が良いか悪いかわからないから適当に）
        yuukiFace.src = "images/yuuki.png"; 

    }, 1000);
}


// ---------------------------------------------------
// 📊 2. 項目別運勢（日替わり固定化！）
// ---------------------------------------------------
function startCategoryFortune() {
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();
    
    yuukiVoice.innerHTML = `「${userName}の今日のステータスは<br>こんな感じかな〜」`;

    // 🎲 日替わり乱数を使う！
    // キーワードを変えることで、項目ごとに違う数字が出るけど、1日固定される
    const love = Math.floor(getDailyRandom("love") * 101);
    const work = Math.floor(getDailyRandom("work") * 101);
    const money = Math.floor(getDailyRandom("money") * 101);
    const human = Math.floor(getDailyRandom("human") * 101);

    // コメント分岐
    let totalComment = "ま、平凡が一番平和ってことよ。";
    if (love > 80 && work > 80) totalComment = "うっわ、最強じゃん！今日何しても上手くいきそう！";
    else if (work > 90) totalComment = "創作の神が降りてきてる！今すぐ何か書きなよ！";
    else if (money > 90) totalComment = "金運やば！奢ってよ（笑）";
    else if (love < 20 && human < 20) totalComment = "…今日は家で大人しく寝とこう。ね？";

    resultArea.innerHTML = `
        <h2>📊 今日のステータス</h2>
        <div class="meter-box">
            <div class="meter-label">💘 恋愛運: ${love}%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${love}%"></div></div>
        </div>
        <div class="meter-box">
            <div class="meter-label">🎨 創作/勉強: ${work}%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${work}%"></div></div>
        </div>
        <div class="meter-box">
            <div class="meter-label">💰 金運: ${money}%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${money}%"></div></div>
        </div>
        <div class="meter-box">
            <div class="meter-label">🤝 対人運: ${human}%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" style="width:${human}%"></div></div>
        </div>
        <div class="yuuki-comment-box">
            <span class="label">ゆうき</span>
            <p>「${totalComment}」</p>
        </div>
        <button onclick="shareResult('【${userName}の運勢】恋愛${love}% 創作${work}% 金運${money}%！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> シェア</button>
        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;
}


// ---------------------------------------------------
// 🎂 3. 誕生日・星座占い（NEW & 日替わり固定）
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

    birthdayForm.classList.add("hidden");
    resultArea.classList.remove("hidden");
    const userName = getName();

    // 星座判定
    const zodiac = getZodiac(parseInt(month), parseInt(day));
    
    // 🎲 日替わり乱数（誕生日＋星座をシードにする）
    const luckScore = Math.floor(getDailyRandom("zodiac" + month + day) * 100);
    
    // コメント
    let msg = "";
    if(luckScore > 80) msg = "星が味方してる！願い事叶うかもよ？";
    else if(luckScore > 50) msg = "可もなく不可もなく。いつも通りが一番！";
    else msg = "ちょっと星の巡りが乱れてるかも。深呼吸してリラックスして。";

    resultArea.innerHTML = `
        <h2>⭐ 星座占い結果</h2>
        <div style="font-size:3rem;">✨</div>
        <h3>${zodiac}の${userName}へ</h3>
        <p style="font-size:1.5rem; color:#ffd700; font-weight:bold;">今日の運勢指数: ${luckScore}</p>
        <div class="yuuki-comment-box">
            <span class="label">ゆうき</span>
            <p>「${msg}」</p>
        </div>
        <button onclick="shareResult('${userName}(${zodiac})の今日の運勢は${luckScore}！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> シェア</button>
        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;
}

// 簡易星座判定
function getZodiac(m, d) {
    const dates = [20,19,21,20,21,22,23,23,23,24,22,22];
    const signs = ["山羊座","水瓶座","魚座","牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座","天秤座","蠍座","射手座","山羊座"];
    return signs[m - (d < dates[m-1] ? 1 : 0)];
}


// ---------------------------------------------------
// ❤️ 4. クラス相性（日替わり固定化！）
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
    compMenu.classList.add("hidden");
    resultArea.classList.remove("hidden");

    if (!classmates || classmates.length === 0) return;

    // 🎲 日替わり乱数でインデックスを決める
    // 名前によって結果が変わるように getName() をシードに含む
    const rand = getDailyRandom("bestmatch"); 
    const bestIndex = Math.floor(rand * classmates.length);
    const bestPartner = classmates[bestIndex];
    
    // スコアも日替わり固定
    const score = 90 + Math.floor(getDailyRandom("bestscore") * 11); // 90-100

    showCompResult(bestPartner, score, "best");
}

// 指名占い準備
function showSelectForm() {
    compMenu.classList.add("hidden");
    selectForm.classList.remove("hidden");
}

// プルダウン更新
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

// 指名占い実行（ここも固定化！）
function calculateSpecificCompatibility() {
    const targetId = document.getElementById("member-select").value;
    if (!targetId) {
        alert("誰か選んでよ〜！");
        return;
    }
    const partner = classmates.find(c => c.id === targetId);
    
    // 🎲 ここを固定化！
    // "partner.id" をシードに入れることで、相手ごとに違うけど、その日は変わらない数字になる
    const rand = getDailyRandom("comp" + partner.id);
    const score = Math.floor(rand * 101); // 0-100
    
    let rank = "bad";
    if (score >= 90) rank = "best";
    else if (score >= 70) rank = "good";
    else if (score >= 40) rank = "normal";

    selectForm.classList.add("hidden");
    resultArea.classList.remove("hidden");
    
    showCompResult(partner, score, rank);
}

// 結果表示（共通）
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

    let partnerImgSrc = `images/${partner.id}.png`;
    if (rank === "bad") partnerImgSrc = `images/${partner.id}_bad.png`;

    resultArea.innerHTML = `
        <h2 style="color:${color}">❤️ 相性診断結果</h2>
        <div class="partner-img">
            <img src="${partnerImgSrc}" onerror="this.src='images/${partner.id}.png'; this.onerror=null;" style="border-color:${color}">
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
    updateYuukiFace(rank);
}


// 共通
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
// 深読みモードは変更なし（前のままでOK）
function startDeepReading() {
    const hour = new Date().getHours();
    
    // 時間チェック（テスト中はコメントアウトしてもOK）
    if (hour < 21 && hour > 4) {
        alert("ゆうき「ん〜、まだ外明るくない？\nこういうのは夜の方が雰囲気出るんだよね〜（21時以降においで）」");
        return;
    }

    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();

    // ランダムなセリフ（data.jsの nightThoughts がなければデフォルト）
    const thoughts = (typeof nightThoughts !== 'undefined') ? nightThoughts : ["君、本当は無理してない？", "夜は素直になれる時間だよ。"];
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)].replace(/{user}/g, userName);

    resultArea.innerHTML = `
        <h2>🌙 深読みモード</h2>
        <div style="background:#000; padding:20px; border-radius:10px; color:#b197fc; border:1px solid #4a2b6b;">
            <p style="font-size:1.2em; font-family:'Zen Maru Gothic'">
                「…ねえ、${userName}。<br><br>
                ${randomThought}」
            </p>
        </div>
        
        <button onclick="shareResult('夜のゆうきに言われた言葉…「${randomThought}」 #ゆうきの気まぐれ占い')" class="menu-btn share-btn">
            <i class="fa-solid fa-share-nodes"></i> シェアする
        </button>

        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;
    
    yuukiFace.src = "images/yuuki_bad.png"; // 怪しい顔
}
