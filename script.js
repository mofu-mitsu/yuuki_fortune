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
const freeCompForm = document.getElementById("free-comp-form"); 
const targetNameInput = document.getElementById("target-name");
const targetImgInput = document.getElementById("target-img-file");
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

// 👀 瞬き機能
function startBlinking() {
    clearInterval(blinkInterval);
    blinkInterval = setInterval(() => {
        if (menuArea.style.display !== "none") {
            yuukiFace.src = "images/yuuki_good.png";
            setTimeout(() => {
                if (menuArea.style.display !== "none") {
                    yuukiFace.src = "images/yuuki.png";
                }
            }, 150);
        }
    }, 4000);
}

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

function resetScreen() {
    menuArea.style.display = "block";
    compMenu.classList.add("hidden");
    selectForm.classList.add("hidden");
    birthdayForm.classList.add("hidden");
    
    // 👇【追加】これを忘れてた！自由入力フォームを隠す命令！
    if(freeCompForm) freeCompForm.classList.add("hidden");
    
    resultArea.classList.add("hidden");
    resultArea.innerHTML = ""; // 結果を空っぽにする
    
    yuukiFace.src = "images/yuuki.png";
    yuukiVoice.innerHTML = `「おかえり、${getName()}。<br>次はどうする？」`;
    
    startBlinking();
}


// ---------------------------------------------------
// 🔮 1. 今日の運勢（タロット）
// ➡ 裏面からのめくり演出追加！
// ---------------------------------------------------
function startDailyFortune() {
    stopBlinking();
    menuArea.style.display = "none";
    resultArea.classList.remove("hidden");
    const userName = getName();

    yuukiVoice.innerHTML = `「${userName}の今日の運勢ね？<br>このカードが運命を告げるよ…」`;
    yuukiFace.src = "images/yuuki.png";

    // 計算
    const rand = getDailyRandom("tarot");
    const cardIndex = Math.floor(rand * tarotDeck.length);
    const card = tarotDeck[cardIndex];
    const comment = card.yuukiComment.replace(/{user}/g, userName);
    const cardImg = card.image || ""; 

    // HTML生成（カードは裏面のまま）
    // 裏面画像がない場合は単色を表示する安全策つき
    resultArea.innerHTML = `
        <h2>📅 今日の運勢結果</h2>
        
        <div class="card-scene">
            <div class="card-object" id="tarot-card-obj">
                <!-- 表面（結果） -->
                <div class="card-face card-face-front">
                    ${cardImg ? `<img src="${cardImg}" style="width:100%; height:100%; border-radius:10px;">` : `<div class="temp-card" style="width:100%;height:100%;background:#fff;color:#000;">${card.name}</div>`}
                </div>
                <!-- 裏面 -->
                <div class="card-face card-face-back">
                    <img src="images/card_back.png" onerror="this.style.display='none';this.parentNode.style.background='#2c1e38';this.parentNode.innerHTML='🔮'">
                </div>
            </div>
        </div>

        <div id="result-text-area" style="opacity:0; transition:opacity 1s;">
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
        </div>
    `;

    // 1秒後にめくる！
    setTimeout(() => {
        const cardObj = document.getElementById("tarot-card-obj");
        const textArea = document.getElementById("result-text-area");
        
        if(cardObj) {
            cardObj.classList.add("is-flipped"); // クラス追加で回転CSS発動
            updateYuukiFace(card.resultType);    // 顔を変える
            
            // さらに0.5秒後にテキストをふわっと出す
            setTimeout(() => {
                if(textArea) textArea.style.opacity = "1";
            }, 500);
        }
    }, 1000);
}


// ---------------------------------------------------
// 🔮 2. 今、この瞬間の運勢（水晶玉）
// ➡ {user}変換バグ修正済み！
// ---------------------------------------------------
function startRandomFortune() {
    stopBlinking();
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
        // メッセージ取得
        let msg = crystalMessages[Math.floor(Math.random() * crystalMessages.length)];
        // 🔧 ここで置換を実行！！
        msg = msg.replace(/{user}/g, userName);

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
// ➡ グラフがグイーンと伸びる演出追加！
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

    // 初期状態は width: 0% で描画
    resultArea.innerHTML = `
        <h2>📊 今日のステータス</h2>
        
        <div class="meter-box">
            <div class="meter-label">💘 恋愛運: <span class="count-up" data-target="${love}">0</span>%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" id="bar-love" style="width:0%"></div></div>
        </div>
        
        <div class="meter-box">
            <div class="meter-label">🎨 創作/勉強: <span class="count-up" data-target="${work}">0</span>%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" id="bar-work" style="width:0%"></div></div>
        </div>
        
        <div class="meter-box">
            <div class="meter-label">💰 金運: <span class="count-up" data-target="${money}">0</span>%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" id="bar-money" style="width:0%"></div></div>
        </div>
        
        <div class="meter-box">
            <div class="meter-label">🤝 対人運: <span class="count-up" data-target="${human}">0</span>%</div>
            <div class="meter-bar-bg"><div class="meter-bar-fill" id="bar-human" style="width:0%"></div></div>
        </div>

        <div class="yuuki-comment-box"><span class="label">ゆうき</span><p>「${totalComment}」</p></div>
        <button onclick="shareResult('【${userName}の運勢】恋愛${love}% 創作${work}% 金運${money}%！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn"><i class="fa-solid fa-share-nodes"></i> シェア</button>
        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;

    // 描画後少し待ってからグラフを伸ばす（これでアニメーションになる）
    setTimeout(() => {
        document.getElementById("bar-love").style.width = `${love}%`;
        document.getElementById("bar-work").style.width = `${work}%`;
        document.getElementById("bar-money").style.width = `${money}%`;
        document.getElementById("bar-human").style.width = `${human}%`;
        
        // 数字のカウントアップ
        document.querySelectorAll('.count-up').forEach(el => {
            const target = +el.getAttribute('data-target');
            let count = 0;
            const inc = Math.ceil(target / 20); // スピード調整
            const timer = setInterval(() => {
                count += inc;
                if (count > target) count = target;
                el.innerText = count;
                if (count === target) clearInterval(timer);
            }, 30);
        });
    }, 100);
}


// script.js の startBirthdayFortune をこれに書き換え！

// ---------------------------------------------------
// 🎂 4. 誕生日・星座占い（当日お祝い機能付き！）
// ---------------------------------------------------
function showBirthdayForm() {
    menuArea.style.display = "none";
    birthdayForm.classList.remove("hidden");
    yuukiVoice.innerHTML = "「誕生日教えて？<br>星の動きを見てあげる！」";
}

function startBirthdayFortune() {
    const month = parseInt(document.getElementById("birth-month").value);
    const day = parseInt(document.getElementById("birth-day").value);
    
    if(!month || !day) {
        alert("月と日を選んでよ〜");
        return;
    }
    stopBlinking();

    birthdayForm.classList.add("hidden");
    resultArea.classList.remove("hidden");
    const userName = getName();
    
    // 星座判定
    const zodiac = getZodiac(month, day);
    
    // 運勢指数（日替わり固定）
    const luckScore = Math.floor(getDailyRandom("zodiac" + month + day) * 100);
    
    // 今日が誕生日かチェック！🎉
    const today = new Date();
    const isBirthday = (today.getMonth() + 1 === month) && (today.getDate() === day);

    let msg = "";
    let specialEffect = ""; // お祝い演出用HTML

    if (isBirthday) {
        // 誕生日おめでとうモード！！🎂
        yuukiFace.src = "images/yuuki_good.png"; // 満面の笑み
        msg = `えっ、今日誕生日なの！？<br>おめでとーーー！！🎉<br>君にとって最高の一年になりますように！`;
        
        // ケーキとかクラッカーの絵文字を降らせる？（簡易的に表示）
        specialEffect = `
            <div style="font-size:4rem; animation: bounce 1s infinite;">🎂🎉🎁</div>
            <p style="color:#ff69b4; font-weight:bold; font-size:1.2rem;">HAPPY BIRTHDAY!!</p>
        `;
    } else {
        // 通常モード
        yuukiFace.src = "images/yuuki.png";
        if(luckScore > 80) msg = "星が味方してる！願い事叶うかもよ？";
        else if(luckScore > 50) msg = "可もなく不可もなく。いつも通りが一番！";
        else msg = "ちょっと星の巡りが乱れてるかも。深呼吸してリラックスして。";
        
        specialEffect = `<div style="font-size:3rem;">✨</div>`;
    }

    resultArea.innerHTML = `
        <h2>⭐ 星座占い結果</h2>
        ${specialEffect}
        
        <h3>${zodiac}の${userName}へ</h3>
        <p style="font-size:1.5rem; color:#ffd700; font-weight:bold;">今日の運勢指数: ${luckScore}</p>
        
        <div class="yuuki-comment-box">
            <span class="label">ゆうき</span>
            <p>「${msg}」</p>
        </div>
        
        <button onclick="shareResult('${userName}(${zodiac})の今日の運勢は${luckScore}！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn">
            <i class="fa-solid fa-share-nodes"></i> シェア
        </button>
        <button onclick="resetScreen()" class="retry-btn">戻る</button>
    `;
}

// 簡易星座判定（変更なし）
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


// 【重要】相性結果表示
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

    let suffix = "";
    if (rank === "best" || rank === "good") suffix = "_good";
    else if (rank === "bad") suffix = "_bad";
    
    let partnerImgSrc = `images/${partner.id}${suffix}.png`;

    resultArea.innerHTML = `
        <h2 style="color:${color}">❤️ 相性診断結果</h2>
        
        <div class="partner-img">
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
    updateYuukiFace(rank);
}

// ---------------------------------------------------
// 🆓 自由入力フォームを表示
// ---------------------------------------------------
function showFreeCompForm() {
    menuArea.style.display = "none";
    
    // 👇【追加】結果画面から飛んできた時のために、結果エリアを隠す！
    resultArea.classList.add("hidden");
    
    freeCompForm.classList.remove("hidden");
    yuukiVoice.innerHTML = "「おっ、クラス外の子？それとも…推し？<br>名前と写真があったら教えてよ。」";
}

// 🆓 自由入力占いの実行（画像処理つき！）
function calculateFreeCompatibility() {
    const targetName = targetNameInput.value.trim();
    if (!targetName) {
        alert("名前を入れてくれないと占えないよ〜💦");
        return;
    }

    const file = targetImgInput.files[0]; // アップロードされたファイル

    // 画像処理は時間がかかる(非同期)ので、関数を分けるかここで処理する
    if (file) {
        // 画像がある場合：読み込んでから結果表示
        const reader = new FileReader();
        reader.onload = function(e) {
            const customImgSrc = e.target.result; // 画像データ(Base64)
            runFreeCompLogic(targetName, customImgSrc);
        };
        reader.readAsDataURL(file);
    } else {
        // 画像がない場合：nullを渡して実行
        runFreeCompLogic(targetName, null);
    }
}

// 自由占いの計算ロジック（画像データの有無を受け取る）
function runFreeCompLogic(targetName, customImgSrc) {
    stopBlinking();
    freeCompForm.classList.add("hidden");
    resultArea.classList.remove("hidden");

    // 日替わり固定計算
    const rand = getDailyRandom("freeComp" + targetName);
    const score = Math.floor(rand * 101); 

    let rank = "bad";
    if (score >= 90) rank = "best";
    else if (score >= 70) rank = "good";
    else if (score >= 40) rank = "normal";

    // ダミーパートナーデータ作成
    const dummyPartner = {
        id: "custom", // カスタムID
        name: targetName,
        fullname: targetName,
        class: "？",
        color: "#66a6ff", 
        types: { mbti: "???", enneagram: "?", socio: "?" },
        bio: "あなたが気になっている人物。<br>二人の運命やいかに…？",
        // ★ここにカスタム画像をセット！
        customImage: customImgSrc, 
        comments: {
            best: "（すごく良い雰囲気を感じる…！）",
            good: "（まんざらでもない様子…？）",
            normal: "（こっちを見ている気がする…）",
            bad: "（今はそっとしておいた方がいいかも…）"
        }
    };

    showCompResult(dummyPartner, score, rank);
}


// script.js の showCompResult 関数をこれに置き換えて！

// 【重要】相性結果表示（戻り先判別ロジック追加版）
function showCompResult(partner, score, rank) {
    const userName = getName();
    const types = partner.types || { mbti: "?", enneagram: "?", socio: "?" };
    const color = partner.color || "#ccc";

    let rawPartnerComment = partner.comments ? partner.comments[rank] : "…";
    let partnerComment = rawPartnerComment.replace(/{user}/g, userName);

    let yuukiComment = "";
    if (rank === "best") yuukiComment = `すっげ！${userName}と相性バッチリじゃん！運命？`;
    else if (rank === "good") yuukiComment = "おー、かなりいい感じ！仲良くなれるよ。";
    else if (rank === "normal") yuukiComment = "ま、普通が一番平和ってことよ。";
    else yuukiComment = "…ま、まあドンマイ！明日があるさ！";

    // 画像パス決定
    let partnerImgSrc;
    if (partner.customImage) {
        partnerImgSrc = partner.customImage;
    } else {
        let suffix = "";
        if (rank === "best" || rank === "good") suffix = "_good";
        else if (rank === "bad") suffix = "_bad";
        partnerImgSrc = `images/${partner.id}${suffix}.png`;
    }

    // 🔄 戻るボタンの分岐ロジック！
    let retryFunc = "startCompatibilityMenu()"; // デフォルト：クラス選択へ
    let retryText = "他の子も占う";

    if (partner.id === "custom") {
        retryFunc = "showFreeCompForm()"; // カスタムの場合：自由入力フォームへ
        retryText = "他の人を占う";
    }

    // HTML生成
    resultArea.innerHTML = `
        <h2 style="color:${color}">❤️ 相性診断結果</h2>
        
        <div class="partner-img">
            <img src="${partnerImgSrc}" 
                 onerror="this.src='images/default.png'; this.onerror=null;" 
                 style="border-color:${color}; object-fit:cover;">
        </div>
        
        <h3>${partner.fullname} <span style="font-size:0.8em">(${partner.class})</span></h3>
        <div class="profile-info" style="border-left: 4px solid ${color}">
            <div><span class="profile-tag">${types.mbti}</span><span class="profile-tag">${types.enneagram}</span><span class="profile-tag">${partner.motif || "?"}</span></div>
            <p class="bio-text">${partner.bio || ""}</p>
        </div>
        <div class="score-box">相性度：<span class="score-num">${score}%</span></div>
        <div class="dialogue-box partner-voice" style="border-left: 5px solid ${color}">
            <span class="label">${partner.name}</span><p>「${partnerComment}」</p>
        </div>
        <div class="yuuki-comment-box"><span class="label">ゆうき</span><p>「${yuukiComment}」</p></div>
        
        <button onclick="shareResult('${partner.name}と${userName}の相性は${score}%！ #ゆうきの気まぐれ占い')" class="menu-btn share-btn">
            <i class="fa-solid fa-share-nodes"></i> シェア
        </button>
        
        <!-- 分岐させたボタン -->
        <button onclick="${retryFunc}" class="retry-btn">
            ${retryText}
        </button>
        
        <button onclick="resetScreen()" class="retry-btn">トップに戻る</button>
    `;
    
    updateYuukiFace(rank);
}

// ---------------------------------------------------
// 🌙 6. 深読みモード
// ---------------------------------------------------
const shadowKeywords = [
    "孤独", "渇望", "解放", "沈黙", "覚醒", "依存", "虚無", "追憶", "衝動", "浄化",
    "哀愁", "乖離", "予感", "欠落", "潜伏", "境界", "矛盾", "回帰", "偽り", "祈り", "崩壊", "迷宮", "残響", "逃避", "変容", "深淵", "秘密", "共鳴", "刹那", "再生"
];
const midnightMissions = [
    "窓を少しだけ開けて、夜の匂いを嗅いでみて。", "スマホの画面を伏せて、1分間目を閉じて。", "誰も見ていないから、変な顔をしてみて。",
    "冷たい水を一杯だけ飲んで、体内を冷まして。", "嫌だった記憶を紙に書いて、ビリビリに破いて。", "お気に入りの曲を、最小の音量で聴いて。",
    "鏡の中の自分と、3秒だけ目を合わせて。", "自分の脈を測って、生きているリズムを感じて。", "部屋の電気を消して、月明かり（または街灯）を探して。",
    "枕に顔をうずめて、一度だけ音にならない叫び声をあげて。", "自分の手のひらをじっと見つめて、手相をなぞってみて。",
    "一番古い写真フォルダを見返して、その時の空気を感じて。", "深呼吸をして、吸う息より吐く息を長くしてみて。",
    "布団の中で、誰にも言えない秘密を一つだけ呟いて。", "壁や床の冷たさを、指先で確かめて。",
    "目を閉じて、一番行きたい場所を具体的に想像して。", "自分自身を、自分でぎゅっと抱きしめてあげて。"
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
