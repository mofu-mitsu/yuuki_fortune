// data.js

// 🏫 クラスメイト名簿データ
// 全員分ここに追加していくよ！
const classmates = [
    // 1-1
    { 
        id: "momoka",
        name: "ももか",
        fullname: "桃花",
        class: "1-1",
        gender: "Female",
        types: { mbti: "ENTJ", enneagram: "8w7", socio: "SLE" },
        motif: "犬",
        bio: "負けず嫌いなツンデレお嬢様。パパっ子。",
        color: "#f9aea5",
        
        // 👇 ここを改造！相性によってセリフが変わる！
        comments: {
            best: "{user}！アンタやるじゃない！特別に私の隣を許可してあげるわ！", // 90~100%
            good: "ふん、アンタにしては上出来じゃない？\nま、私が優秀だから当然の結果ね！", // 70~89%
            normal: "ふーん、普通ね。\nもっと面白い結果が出ると思ったのに、退屈だわ。", // 40~69%
            bad: "ちょっと！何この数字！💢\nアンタ、私の足引っ張らないでよね！" // 0~39%
        }
    },

    { name: "みみか", class: "1-1", type: "INTJ", motif: "白猫", color: "white" },
    { name: "ひなか", class: "1-1", type: "ESFP", motif: "アメショ", color: "orange" },
    
    // 1-4 (ゆうきくんのクラス)
    { 
        id: "yuuki",
        name: "ゆうき",
        fullname: "ゆうき",
        class: "1-4",
        gender: "Male",
        types: { mbti: "ISFP", enneagram: "9w1", socio: "SEI" },
        motif: "猫",
        bio: "親しみやすい占い師。でもうさんくさい。",
        color: "#a982ff",
        comments: {
            best: "うおっマジ！？運命感じちゃうな〜！\n今日から俺たちズッ友確定ね！",
            good: "お、いい感じじゃん！\n今度一緒にタピオカでも飲み行く？",
            normal: "まあまあかな〜。\n可もなく不可もなくってやつ？平和が一番だよ。",
            bad: "あちゃ〜…水と油って感じ？\nま、気にしない気にしない！"
        }
    },
    { name: "ゆきひこ", class: "1-4", type: "ENFP", motif: "プードル", color: "pink" },
    { name: "あやと", class: "1-4", type: "ENFP", motif: "ミヌエット", color: "green" },

    // 3-1 (ご褒美とか)
    { name: "ご褒美", class: "3-1", type: "INFP", motif: "豚", color: "pink" },
    
    // ...ここに全員分足していく！
];

// 🃏 とりの丘高校オリジナルタロット
// ゆうきくんオリジナルの解釈カード
const tarotDeck = [
    {
        name: "ワンドの3",
        meaning: "そろそろ動き出す時かも？",
        yuukiComment: "準備運動は終わった？まあ焦らなくてもいいけどさ〜、行っちゃいなよ！",
        resultType: "bad"
    },
    {
        name: "カップのペイジ",
        meaning: "新しいトキメキの予感",
        yuukiComment: "なんか楽しいことありそうじゃない？直感信じてみてよ。俺の占いより当たるかも（笑）"
    },
    {
        name: "ソードの9",
        meaning: "考えすぎ注意報",
        yuukiComment: "うわ、夜更かしして変なこと考えてない？寝不足はお肌に悪いよ〜。とりあえず寝よ？",
        resultType: "bad"
    },
    {
        id: "sun",
        name: "太陽 (The Sun)",
        image: "images/card_sun.png", // みつきが描いた画像
        meaning: "絶好調！まぶしすぎて直視できないレベル！",
        yuukiComment: "うおっ！めっちゃいいの出た！\n今日は何しても許される気がする！知らんけど！",
        resultType: "good" // good, bad, normal でゆうきの表情を変える
    },
    {
        id: "tower",
        name: "塔 (The Tower)",
        image: "images/card_tower.png",
        meaning: "予期せぬトラブル…衝撃に備えて！",
        yuukiComment: "あ〜…これ出ちゃったか〜…。\nドンマイ。今日は家で大人しく寝とくのが吉かも。",
        resultType: "bad"
    },
    {
        name: "【レア】みりんてゃ",
        meaning: "地雷注意！？でも可愛さは正義",
        yuukiComment: "あ〜…これ出ちゃったか。甘い誘惑には気をつけてね？沼ると抜け出せないよ〜"
    },
    {
        name: "【レア】ご褒美",
        meaning: "自分を甘やかして吉",
        yuukiComment: "今日はもう頑張らなくていいよ！好きなもの食べてゴロゴロしちゃえ！だゾッ！"
    },
    {
        id: "werewolf",
        name: "【レア】人狼",
        image: "images/card_werewolf.png",
        meaning: "誰かが嘘をついている…？背後に気をつけて。",
        yuukiComment: "ん〜？誰か猫かぶってるかもね。\n…あ、嘘を見抜く練習してみる？",
        resultType: "bad",
        // 👇 ここにおすすめツールのリンクを入れる！
        recommendLink: "https://mofu-mitsu.github.io/Torinooka-Werewolf/",
        recommendText: "嘘を見抜く練習をする（人狼ゲームへ）"
    }
];

// 🌙 夜のつぶやきリスト（深読みモード用）
const nightThoughts = [
    "ねえ、{user}。最近「自分なんて」って思ってない？",
    "本当は誰かに甘えたいんじゃない？俺でよければ聞くけど。",
    "昼間笑ってるけど、夜はしんどい時あるでしょ？",
    "意外と周りは{user}のこと見てると思うよ〜。",
    "完璧じゃなくていいんだよ。猫みたいに気まぐれでいいの。",
    "…たまには泣いてもいいんじゃない？"
];