import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))

const migrationPath = join(
  rootDir,
  'supabase/migrations/20260701124500_expand_core_content.sql',
)
const seedPath = join(rootDir, 'supabase/seeds/core_content_generated.sql')

const levels = ['Beginner', 'Elementary', 'Intermediate']

function sql(value) {
  if (value === null || value === undefined) return 'null'
  return `'${String(value).replaceAll("'", "''")}'`
}

function levelForIndex(index) {
  if (index % 10 < 5) return 'Beginner'
  if (index % 10 < 8) return 'Elementary'
  return 'Intermediate'
}

function slug(text) {
  return text
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const grammarItems = [
  ['core-g-present-simple-question', '現在形の疑問文', 'Do/Doesを文頭に置いて、普段の習慣や事実を尋ねる。', 'Do you live near here? / Does she work today?', 'Beginner'],
  ['core-g-present-simple-negative', '現在形の否定文', 'do not / does notを使って、普段しないことや事実ではないことを伝える。', 'I do not drink coffee. / He does not drive.', 'Beginner'],
  ['core-g-be-question', 'be動詞の疑問文', 'be動詞を主語の前に出して状態や場所を尋ねる。', 'Are you ready? / Is this your bag?', 'Beginner'],
  ['core-g-be-negative', 'be動詞の否定文', 'be動詞の後ろにnotを置いて否定する。', 'I am not busy. / This is not mine.', 'Beginner'],
  ['core-g-this-that', 'this / that / these / those', '近いもの・遠いもの、単数・複数を区別して指す。', 'This is my phone. / Those are your keys.', 'Beginner'],
  ['core-g-there-question', 'Is there / Are there', '何かがあるかどうかを尋ねる。', 'Is there a restroom near here?', 'Beginner'],
  ['core-g-countable-uncountable', '数えられる名詞と数えられない名詞', 'a/anやsomeを使い分けて量を表す。', 'I need a chair. / I need some water.', 'Beginner'],
  ['core-g-some-any', 'some / any', '肯定文ではsome、疑問文や否定文ではanyをよく使う。', 'I have some time. / Do you have any questions?', 'Beginner'],
  ['core-g-wh-questions', '基本のWH疑問文', 'what/where/when/who/why/howで具体的な情報を尋ねる。', 'Where do you live? / How do you feel?', 'Beginner'],
  ['core-g-how-much', 'How much / How many', '値段や量、数を尋ねるときに使う。数えられないものはHow much、数えられるものはHow manyを使う。', 'How much is this? / How many tickets do you need?', 'Beginner'],
  ['core-g-frequency-adverbs', '頻度を表す副詞', 'always/usually/sometimes/neverなどで頻度を伝える。', 'I usually cook at home.', 'Beginner'],
  ['core-g-present-continuous', '現在進行形', '今していることや一時的な状態を表す。', 'I am waiting for the bus.', 'Beginner'],
  ['core-g-present-continuous-future', '現在進行形で表す予定', '決まっている近い予定を現在進行形で表す。', 'I am meeting a friend tonight.', 'Elementary'],
  ['core-g-past-be', 'be動詞の過去形', 'was/wereで過去の状態を伝える。', 'I was tired yesterday. / They were late.', 'Beginner'],
  ['core-g-past-irregular', '不規則動詞の過去形', 'go/went, have/hadなど形が変わる過去形を使う。', 'I went to the store. / We had lunch.', 'Beginner'],
  ['core-g-past-question', '過去形の疑問文', 'Didを文頭に置き、動詞は原形に戻す。', 'Did you see the message?', 'Beginner'],
  ['core-g-past-negative', '過去形の否定文', 'did notの後ろに動詞の原形を置く。', 'I did not understand the question.', 'Beginner'],
  ['core-g-future-will', 'will', 'その場で決めたことや未来の予測を伝える。', 'I will call you later.', 'Beginner'],
  ['core-g-may-might', 'may / might', '可能性があることを控えめに伝える。', 'It might rain later.', 'Elementary'],
  ['core-g-should-advice', 'should', '助言や軽い義務を伝える。', 'You should take a break.', 'Elementary'],
  ['core-g-have-to', 'have to', '必要性や義務を伝える。', 'I have to leave now.', 'Beginner'],
  ['core-g-dont-have-to', 'do not have to', 'する必要がないことを伝える。', 'You do not have to hurry.', 'Elementary'],
  ['core-g-must', 'must', '強い必要性や確信を伝える。', 'You must be careful. / He must be tired.', 'Elementary'],
  ['core-g-would-like-to', 'would like to', '丁寧にしたいことを伝える。', 'I would like to ask a question.', 'Elementary'],
  ['core-g-could-you', 'Could you ~?', '丁寧に依頼する。', 'Could you help me?', 'Elementary'],
  ['core-g-can-i', 'Can I ~?', '許可を求める。', 'Can I use this chair?', 'Beginner'],
  ['core-g-let-me', 'Let me ~', '自分が何かをすることを申し出る。', 'Let me check.', 'Elementary'],
  ['core-g-lets', "Let's ~", '一緒に何かをしようと提案する。', "Let's take a break.", 'Beginner'],
  ['core-g-need-to', 'need to', '必要な行動を伝える。', 'I need to buy groceries.', 'Beginner'],
  ['core-g-want-someone-to', 'want someone to ~', '誰かにしてほしいことを伝える。', 'I want you to listen carefully.', 'Elementary'],
  ['core-g-like-to-ing', 'like to / like -ing', '好みや習慣として好きなことを伝える。', 'I like to walk. / I like walking.', 'Beginner'],
  ['core-g-good-at', 'be good at', '得意なことを伝える。', 'She is good at explaining things.', 'Elementary'],
  ['core-g-interested-in', 'be interested in', '興味があることを伝える。', 'I am interested in design.', 'Elementary'],
  ['core-g-comparative', '比較級', '2つを比べて「より〜」と言う。', 'This one is cheaper than that one.', 'Elementary'],
  ['core-g-superlative', '最上級', '3つ以上の中で一番であることを伝える。', 'This is the best option.', 'Elementary'],
  ['core-g-as-as', 'as ~ as', '同じくらいであることを伝える。', 'This room is as large as mine.', 'Elementary'],
  ['core-g-too-enough', 'too / enough', '程度が過ぎること、十分であることを伝える。', 'It is too expensive. / It is good enough.', 'Elementary'],
  ['core-g-gerund-subject', '動名詞を主語にする', '行動そのものを主語として話す。', 'Learning English takes time.', 'Elementary'],
  ['core-g-infinitive-purpose', 'to不定詞の目的', '何のためにするのかを伝える。', 'I went there to meet a friend.', 'Elementary'],
  ['core-g-because-so', 'because / so', '理由と結果をつなぐ。', 'I was tired, so I went home early.', 'Beginner'],
  ['core-g-when-if', 'when / if', '時や条件を表す節を作る。', 'Call me when you arrive. / If it rains, I will stay home.', 'Elementary'],
  ['core-g-before-after', 'before / after', '行動の前後関係を伝える。', 'I brush my teeth before I sleep.', 'Beginner'],
  ['core-g-while', 'while', '同時に起きていることを伝える。', 'I listened to music while I cooked.', 'Elementary'],
  ['core-g-present-perfect-result', '現在完了 (結果)', '過去の出来事が今に影響していることを伝える。', 'I have lost my key.', 'Elementary'],
  ['core-g-present-perfect-since-for', 'since / for', '現在完了で継続期間を伝える。', 'I have lived here for two years.', 'Intermediate'],
  ['core-g-used-to', 'used to', '昔はしていたが今はしていない習慣を伝える。', 'I used to play tennis.', 'Intermediate'],
  ['core-g-be-used-to', 'be used to', '慣れていることを伝える。', 'I am used to waking up early.', 'Intermediate'],
  ['core-g-get-used-to', 'get used to', '慣れていく過程を伝える。', 'I am getting used to this job.', 'Intermediate'],
  ['core-g-first-conditional', '仮定法ではない条件文', '現実的な条件と結果を伝える。', 'If I have time, I will call you.', 'Elementary'],
  ['core-g-third-conditional', '仮定法過去完了', '過去と違う仮定を伝える。', 'If I had known, I would have helped.', 'Intermediate'],
  ['core-g-relative-where-when', '関係副詞 where / when', '場所や時を後ろから説明する。', 'This is the place where we met.', 'Intermediate'],
  ['core-g-participle-adjective', '分詞形容詞', 'interesting/interestedのように感情や性質を説明する。', 'The movie was interesting. / I was interested.', 'Intermediate'],
  ['core-g-passive-past', '過去の受動態', '過去に「〜された」ことを伝える。', 'The room was cleaned yesterday.', 'Intermediate'],
  ['core-g-causative-have', '使役 have/get', '誰かに何かをしてもらうことを伝える。', 'I had my phone repaired.', 'Intermediate'],
  ['core-g-indirect-question', '間接疑問文', '丁寧に質問や不明点を伝える。', 'Do you know where the station is?', 'Intermediate'],
  ['core-g-tag-question', '付加疑問文', '確認のために文末へ短い疑問をつける。', 'It is nice, isn’t it?', 'Intermediate'],
]

const nouns = [
  ['address', '住所'],
  ['answer', '答え'],
  ['apartment', 'アパート'],
  ['appointment', '予約'],
  ['bag', 'バッグ'],
  ['bank', '銀行'],
  ['bathroom', 'トイレ'],
  ['bed', 'ベッド'],
  ['bill', '請求書'],
  ['book', '本'],
  ['bottle', 'ボトル'],
  ['box', '箱'],
  ['breakfast', '朝食'],
  ['bus', 'バス'],
  ['business', '仕事'],
  ['camera', 'カメラ'],
  ['card', 'カード'],
  ['chair', '椅子'],
  ['change', 'お釣り'],
  ['city', '街'],
  ['class', '授業'],
  ['clothes', '服'],
  ['coffee', 'コーヒー'],
  ['company', '会社'],
  ['computer', 'コンピューター'],
  ['conversation', '会話'],
  ['country', '国'],
  ['date', '日付'],
  ['day', '日'],
  ['desk', '机'],
  ['dinner', '夕食'],
  ['doctor', '医師'],
  ['document', '書類'],
  ['door', 'ドア'],
  ['drink', '飲み物'],
  ['email', 'メール'],
  ['event', 'イベント'],
  ['family', '家族'],
  ['food', '食べ物'],
  ['friend', '友人'],
  ['gift', '贈り物'],
  ['grocery', '食料品'],
  ['home', '家'],
  ['hotel', 'ホテル'],
  ['idea', '考え'],
  ['information', '情報'],
  ['job', '仕事'],
  ['key', '鍵'],
  ['kitchen', '台所'],
  ['language', '言語'],
  ['lesson', 'レッスン'],
  ['letter', '手紙'],
  ['line', '列'],
  ['lunch', '昼食'],
  ['manager', '上司'],
  ['map', '地図'],
  ['market', '市場'],
  ['meal', '食事'],
  ['medicine', '薬'],
  ['meeting', '会議'],
  ['message', 'メッセージ'],
  ['money', 'お金'],
  ['morning', '朝'],
  ['movie', '映画'],
  ['name', '名前'],
  ['neighbor', '近所の人'],
  ['news', 'ニュース'],
  ['notebook', 'ノート'],
  ['office', 'オフィス'],
  ['order', '注文'],
  ['park', '公園'],
  ['party', 'パーティー'],
  ['passport', 'パスポート'],
  ['phone', '電話'],
  ['photo', '写真'],
  ['plan', '計画'],
  ['price', '価格'],
  ['problem', '問題'],
  ['project', 'プロジェクト'],
  ['question', '質問'],
  ['receipt', 'レシート'],
  ['reservation', '予約'],
  ['restaurant', 'レストラン'],
  ['road', '道路'],
  ['room', '部屋'],
  ['schedule', '予定'],
  ['school', '学校'],
  ['seat', '座席'],
  ['shop', '店'],
  ['station', '駅'],
  ['store', '店'],
  ['street', '通り'],
  ['student', '学生'],
  ['table', 'テーブル'],
  ['taxi', 'タクシー'],
  ['ticket', 'チケット'],
  ['time', '時間'],
  ['train', '電車'],
  ['trip', '旅行'],
  ['umbrella', '傘'],
  ['wallet', '財布'],
  ['water', '水'],
  ['week', '週'],
  ['work', '仕事'],
]

const adjectives = [
  ['bad', '悪い'],
  ['beautiful', '美しい'],
  ['big', '大きい'],
  ['busy', '忙しい'],
  ['cheap', '安い'],
  ['clean', '清潔な'],
  ['cold', '冷たい'],
  ['comfortable', '快適な'],
  ['common', 'よくある'],
  ['dark', '暗い'],
  ['different', '違う'],
  ['difficult', '難しい'],
  ['easy', '簡単な'],
  ['empty', '空の'],
  ['expensive', '高価な'],
  ['famous', '有名な'],
  ['fast', '速い'],
  ['favorite', 'お気に入りの'],
  ['free', '無料の'],
  ['fresh', '新鮮な'],
  ['friendly', '親切な'],
  ['full', '満杯の'],
  ['good', '良い'],
  ['great', '素晴らしい'],
  ['happy', '幸せな'],
  ['hard', '難しい'],
  ['heavy', '重い'],
  ['hot', '熱い'],
  ['important', '重要な'],
  ['interesting', '面白い'],
  ['kind', '親切な'],
  ['large', '大きな'],
  ['late', '遅い'],
  ['light', '軽い'],
  ['local', '地元の'],
  ['long', '長い'],
  ['new', '新しい'],
  ['next', '次の'],
  ['nice', '良い'],
  ['old', '古い'],
  ['open', '開いている'],
  ['popular', '人気の'],
  ['possible', '可能な'],
  ['personal', '個人的な'],
  ['quiet', '静かな'],
  ['ready', '準備できた'],
  ['right', '正しい'],
  ['safe', '安全な'],
  ['short', '短い'],
  ['small', '小さい'],
  ['special', '特別な'],
  ['strong', '強い'],
  ['sure', '確かな'],
  ['tired', '疲れた'],
  ['useful', '役に立つ'],
  ['warm', '暖かい'],
  ['wrong', '間違った'],
]

const verbs = [
  ['ask', '尋ねる'],
  ['bring', '持ってくる'],
  ['buy', '買う'],
  ['call', '電話する'],
  ['carry', '運ぶ'],
  ['change', '変える'],
  ['check', '確認する'],
  ['choose', '選ぶ'],
  ['clean', '掃除する'],
  ['close', '閉める'],
  ['cook', '料理する'],
  ['decide', '決める'],
  ['drink', '飲む'],
  ['drive', '運転する'],
  ['eat', '食べる'],
  ['enjoy', '楽しむ'],
  ['explain', '説明する'],
  ['feel', '感じる'],
  ['find', '見つける'],
  ['finish', '終える'],
  ['follow', '従う'],
  ['forget', '忘れる'],
  ['get', '得る'],
  ['give', '与える'],
  ['go', '行く'],
  ['help', '助ける'],
  ['join', '参加する'],
  ['keep', '保つ'],
  ['know', '知る'],
  ['learn', '学ぶ'],
  ['leave', '出発する'],
  ['listen', '聞く'],
  ['look', '見る'],
  ['make', '作る'],
  ['meet', '会う'],
  ['move', '動く'],
  ['need', '必要とする'],
  ['open', '開ける'],
  ['order', '注文する'],
  ['pay', '支払う'],
  ['practice', '練習する'],
  ['read', '読む'],
  ['remember', '覚えている'],
  ['say', '言う'],
  ['send', '送る'],
  ['show', '見せる'],
  ['sit', '座る'],
  ['speak', '話す'],
  ['start', '始める'],
  ['stay', '滞在する'],
  ['study', '勉強する'],
  ['take', '取る'],
  ['talk', '話す'],
  ['tell', '伝える'],
  ['think', '考える'],
  ['try', '試す'],
  ['understand', '理解する'],
  ['use', '使う'],
  ['visit', '訪れる'],
  ['wait', '待つ'],
  ['walk', '歩く'],
  ['want', '欲しい'],
  ['watch', '見る'],
  ['work', '働く'],
  ['write', '書く'],
]

const adverbs = [
  ['again', 'もう一度'],
  ['almost', 'ほとんど'],
  ['already', 'すでに'],
  ['always', 'いつも'],
  ['carefully', '注意深く'],
  ['early', '早く'],
  ['easily', '簡単に'],
  ['enough', '十分に'],
  ['especially', '特に'],
  ['finally', 'ついに'],
  ['first', '最初に'],
  ['here', 'ここで'],
  ['later', '後で'],
  ['maybe', 'たぶん'],
  ['never', '決してない'],
  ['often', 'よく'],
  ['quickly', '素早く'],
  ['really', '本当に'],
  ['recently', '最近'],
  ['slowly', 'ゆっくり'],
  ['sometimes', '時々'],
  ['soon', 'すぐに'],
  ['still', 'まだ'],
  ['then', 'それから'],
  ['there', 'そこで'],
  ['today', '今日'],
  ['together', '一緒に'],
  ['tomorrow', '明日'],
  ['tonight', '今夜'],
  ['usually', 'たいてい'],
  ['very', 'とても'],
  ['well', '上手に'],
  ['yesterday', '昨日'],
]

const functionPhrases = [
  ['a little', '少し', 'phrase', 'I speak a little English.', '私は少し英語を話します。'],
  ['a lot of', 'たくさんの', 'phrase', 'I have a lot of work today.', '今日はたくさん仕事があります。'],
  ['at home', '家で', 'phrase', 'I usually eat at home.', '私はたいてい家で食べます。'],
  ['at least', '少なくとも', 'phrase', 'It takes at least ten minutes.', '少なくとも10分かかります。'],
  ['at night', '夜に', 'phrase', 'I study at night.', '私は夜に勉強します。'],
  ['at the same time', '同時に', 'phrase', 'We arrived at the same time.', '私たちは同時に到着しました。'],
  ['by bus', 'バスで', 'phrase', 'I go to work by bus.', '私はバスで仕事に行きます。'],
  ['by train', '電車で', 'phrase', 'I went there by train.', '私は電車でそこへ行きました。'],
  ['for example', '例えば', 'phrase', 'For example, we can meet tomorrow.', '例えば、明日会えます。'],
  ['for now', '今のところ', 'phrase', 'This is enough for now.', '今のところこれで十分です。'],
  ['from now on', 'これからは', 'phrase', 'I will be careful from now on.', 'これからは気をつけます。'],
  ['in front of', '〜の前に', 'phrase', 'I am in front of the station.', '私は駅の前にいます。'],
  ['in general', '一般的に', 'phrase', 'In general, it is safe.', '一般的に、それは安全です。'],
  ['in the morning', '朝に', 'phrase', 'I exercise in the morning.', '私は朝に運動します。'],
  ['next to', '〜の隣に', 'phrase', 'The cafe is next to the bank.', 'カフェは銀行の隣です。'],
  ['of course', 'もちろん', 'phrase', 'Of course, I can help.', 'もちろん、手伝えます。'],
  ['on foot', '徒歩で', 'phrase', 'I went there on foot.', '私は徒歩でそこへ行きました。'],
  ['on time', '時間通りに', 'phrase', 'The train arrived on time.', '電車は時間通りに到着しました。'],
  ['right now', '今すぐ', 'phrase', 'I need help right now.', '今すぐ助けが必要です。'],
  ['so far', '今のところ', 'phrase', 'Everything is fine so far.', '今のところすべて順調です。'],
]

const verbFrames = [
  ['ask', 'a question', '質問する', 'I want to ask a question.', '質問したいです。'],
  ['answer', 'the phone', '電話に出る', 'Can you answer the phone?', '電話に出てもらえますか？'],
  ['bring', 'an umbrella', '傘を持ってくる', 'Please bring an umbrella.', '傘を持ってきてください。'],
  ['buy', 'groceries', '食料品を買う', 'I need to buy groceries.', '食料品を買う必要があります。'],
  ['call', 'a friend', '友人に電話する', 'I will call a friend later.', '後で友人に電話します。'],
  ['check', 'the schedule', '予定を確認する', 'Let me check the schedule.', '予定を確認させてください。'],
  ['choose', 'a seat', '席を選ぶ', 'You can choose a seat.', '席を選べます。'],
  ['clean', 'the room', '部屋を掃除する', 'I cleaned the room yesterday.', '昨日部屋を掃除しました。'],
  ['close', 'the door', 'ドアを閉める', 'Please close the door.', 'ドアを閉めてください。'],
  ['cook', 'dinner', '夕食を作る', 'I will cook dinner tonight.', '今夜夕食を作ります。'],
  ['drink', 'water', '水を飲む', 'I need to drink water.', '水を飲む必要があります。'],
  ['eat', 'breakfast', '朝食を食べる', 'I eat breakfast at seven.', '私は7時に朝食を食べます。'],
  ['explain', 'the problem', '問題を説明する', 'Can you explain the problem?', '問題を説明してもらえますか？'],
  ['find', 'my key', '鍵を見つける', 'I need to find my key.', '鍵を見つける必要があります。'],
  ['finish', 'the project', 'プロジェクトを終える', 'We need to finish the project.', 'プロジェクトを終える必要があります。'],
  ['forget', 'my wallet', '財布を忘れる', 'I forgot my wallet.', '財布を忘れました。'],
  ['get', 'a ticket', 'チケットを手に入れる', 'I need to get a ticket.', 'チケットを手に入れる必要があります。'],
  ['give', 'directions', '道案内をする', 'Can you give me directions?', '道案内してもらえますか？'],
  ['go', 'home', '家に帰る', 'I want to go home.', '家に帰りたいです。'],
  ['help', 'a customer', '客を助ける', 'I helped a customer.', 'お客さんを助けました。'],
  ['join', 'a meeting', '会議に参加する', 'I will join a meeting.', '会議に参加します。'],
  ['keep', 'a promise', '約束を守る', 'Please keep your promise.', '約束を守ってください。'],
  ['learn', 'English', '英語を学ぶ', 'I want to learn English.', '英語を学びたいです。'],
  ['leave', 'early', '早く出る', 'I have to leave early.', '早く出なければなりません。'],
  ['listen to', 'music', '音楽を聞く', 'I like to listen to music.', '音楽を聞くのが好きです。'],
  ['look for', 'a hotel', 'ホテルを探す', 'I am looking for a hotel.', 'ホテルを探しています。'],
  ['make', 'a plan', '計画を立てる', 'Let’s make a plan.', '計画を立てましょう。'],
  ['meet', 'a coworker', '同僚に会う', 'I will meet a coworker.', '同僚に会います。'],
  ['open', 'the window', '窓を開ける', 'Please open the window.', '窓を開けてください。'],
  ['order', 'coffee', 'コーヒーを注文する', 'I want to order coffee.', 'コーヒーを注文したいです。'],
  ['pay', 'the bill', '会計を払う', 'I will pay the bill.', '会計を払います。'],
  ['practice', 'speaking', '話す練習をする', 'I practice speaking every day.', '毎日話す練習をします。'],
  ['read', 'a book', '本を読む', 'I read a book at night.', '夜に本を読みます。'],
  ['remember', 'the address', '住所を覚える', 'Please remember the address.', '住所を覚えてください。'],
  ['send', 'a message', 'メッセージを送る', 'I will send a message.', 'メッセージを送ります。'],
  ['show', 'my passport', 'パスポートを見せる', 'I showed my passport.', 'パスポートを見せました。'],
  ['take', 'a taxi', 'タクシーに乗る', 'Let’s take a taxi.', 'タクシーに乗りましょう。'],
  ['talk about', 'the plan', '計画について話す', 'Let’s talk about the plan.', '計画について話しましょう。'],
  ['try on', 'a shirt', 'シャツを試着する', 'Can I try on this shirt?', 'このシャツを試着できますか？'],
  ['use', 'a computer', 'コンピューターを使う', 'I use a computer every day.', '毎日コンピューターを使います。'],
  ['wait for', 'the train', '電車を待つ', 'I am waiting for the train.', '電車を待っています。'],
  ['write', 'an email', 'メールを書く', 'I need to write an email.', 'メールを書く必要があります。'],
]

const vocabulary = []
const seenIds = new Set()

function addVocab(id, word, meaningJa, partOfSpeech, exampleEn, exampleJa, level) {
  const safeId = `core-${slug(id)}`.slice(0, 120)
  if (seenIds.has(safeId)) return
  seenIds.add(safeId)
  vocabulary.push({
    id: safeId,
    word,
    meaningJa,
    partOfSpeech,
    exampleEn,
    exampleJa,
    level,
  })
}

nouns.forEach(([word, ja], index) => {
  addVocab(`noun-${word}`, word, ja, 'noun', `I need this ${word}.`, `この${ja}が必要です。`, levelForIndex(index))
})

verbs.forEach(([word, ja], index) => {
  addVocab(`verb-${word}`, word, ja, 'verb', `I want to ${word} today.`, `今日は${ja}したいです。`, levelForIndex(index + 2))
})

adjectives.forEach(([word, ja], index) => {
  addVocab(`adj-${word}`, word, ja, 'adjective', `It is ${word}.`, `それは${ja}です。`, levelForIndex(index + 4))
})

adverbs.forEach(([word, ja], index) => {
  addVocab(`adv-${word}`, word, ja, 'adverb', `Please do it ${word}.`, `${ja}やってください。`, levelForIndex(index + 6))
})

functionPhrases.forEach(([word, ja, partOfSpeech, exampleEn, exampleJa], index) => {
  addVocab(`phrase-${word}`, word, ja, partOfSpeech, exampleEn, exampleJa, levelForIndex(index + 8))
})

const nounMap = new Map(nouns)
const adjMap = new Map(adjectives)

function jaOfNoun(noun) {
  return nounMap.get(noun) ?? noun
}

function jaOfAdjective(adjective) {
  return adjMap.get(adjective) ?? adjective
}

const collocationGroups = [
  {
    label: 'portable',
    nouns: ['bag', 'bottle', 'box', 'camera', 'card', 'computer', 'document', 'key', 'notebook', 'passport', 'phone', 'photo', 'receipt', 'ticket', 'umbrella', 'wallet'],
    adjectives: ['new', 'old', 'small', 'big', 'heavy', 'light', 'expensive', 'cheap', 'important', 'useful', 'personal', 'safe'],
    example: 'I have {article} {phrase}.',
    exampleJa: '私は{meaning}を持っています。',
  },
  {
    label: 'place',
    nouns: ['apartment', 'bank', 'bathroom', 'city', 'company', 'country', 'home', 'hotel', 'kitchen', 'market', 'office', 'park', 'restaurant', 'room', 'school', 'shop', 'station', 'store', 'street'],
    adjectives: ['new', 'old', 'big', 'small', 'clean', 'busy', 'quiet', 'famous', 'local', 'safe', 'comfortable', 'popular'],
    example: 'This is {article} {phrase}.',
    exampleJa: 'これは{meaning}です。',
  },
  {
    label: 'food',
    nouns: ['breakfast', 'coffee', 'dinner', 'drink', 'food', 'grocery', 'lunch', 'meal', 'water'],
    adjectives: ['good', 'great', 'fresh', 'hot', 'cold', 'cheap', 'expensive', 'special', 'favorite', 'popular'],
    example: 'I want {phrase}.',
    exampleJa: '{meaning}が欲しいです。',
  },
  {
    label: 'work-info',
    nouns: ['answer', 'appointment', 'business', 'class', 'conversation', 'date', 'document', 'email', 'event', 'idea', 'information', 'job', 'language', 'lesson', 'meeting', 'message', 'name', 'news', 'plan', 'problem', 'project', 'question', 'reservation', 'schedule', 'work'],
    adjectives: ['new', 'good', 'bad', 'important', 'useful', 'common', 'different', 'difficult', 'easy', 'special', 'possible', 'right'],
    example: 'This is {article} {phrase}.',
    exampleJa: 'これは{meaning}です。',
  },
  {
    label: 'social',
    nouns: ['doctor', 'family', 'friend', 'manager', 'neighbor', 'student'],
    adjectives: ['new', 'old', 'good', 'great', 'friendly', 'kind', 'happy', 'busy', 'tired', 'important'],
    example: 'He is {article} {phrase}.',
    exampleJa: '彼は{meaning}です。',
  },
  {
    label: 'time-event',
    nouns: ['day', 'morning', 'party', 'time', 'trip', 'week'],
    adjectives: ['good', 'bad', 'busy', 'different', 'favorite', 'free', 'great', 'important', 'long', 'special'],
    example: 'It was {article} {phrase}.',
    exampleJa: 'それは{meaning}でした。',
  },
  {
    label: 'home-object',
    nouns: ['bed', 'chair', 'desk', 'door', 'table', 'seat'],
    adjectives: ['new', 'old', 'big', 'small', 'clean', 'comfortable', 'heavy', 'light', 'open', 'safe'],
    example: 'This is {article} {phrase}.',
    exampleJa: 'これは{meaning}です。',
  },
]

collocationGroups.forEach((group, groupIndex) => {
  group.nouns.forEach((noun, nounIndex) => {
    group.adjectives.forEach((adjective, adjectiveIndex) => {
      const phrase = `${adjective} ${noun}`
      const meaning = `${jaOfAdjective(adjective)}${jaOfNoun(noun)}`
      const article = /^[aeiou]/.test(adjective) ? 'an' : 'a'
      addVocab(
        `collocation-${group.label}-${phrase}`,
        phrase,
        meaning,
        'phrase',
        group.example.replace('{article}', article).replace('{phrase}', phrase),
        group.exampleJa.replace('{meaning}', meaning),
        levels[(groupIndex + nounIndex + adjectiveIndex) % levels.length],
      )
    })
  })
})

const determinerChunks = [
  ['my', '私の', 'I lost {phrase}.', '{meaning}をなくしました。'],
  ['your', 'あなたの', 'Is this {phrase}?', 'これは{meaning}ですか？'],
  ['this', 'この', 'I need {phrase}.', '{meaning}が必要です。'],
  ['the', 'その', 'Please check {phrase}.', '{meaning}を確認してください。'],
]

nouns.forEach(([noun, nounJa], nounIndex) => {
  determinerChunks.forEach(([determiner, determinerJa, example, exampleJa], chunkIndex) => {
    const phrase = `${determiner} ${noun}`
    const meaning = `${determinerJa}${nounJa}`
    addVocab(
      `determiner-${phrase}`,
      phrase,
      meaning,
      'phrase',
      example.replace('{phrase}', phrase),
      exampleJa.replace('{meaning}', meaning),
      levels[(nounIndex + chunkIndex) % levels.length],
    )
  })
})

const verbChunkPatterns = [
  ['I need to', '〜する必要がある', 'I need to {verb} today.', '今日は「I need to {verb}」で{verbJa}必要があることを伝えます。'],
  ['I want to', '〜したい', 'I want to {verb} soon.', '「I want to {verb}」で{verbJa}したい気持ちを伝えます。'],
  ['Can I', '〜してもいいですか', 'Can I {verb} here?', '「Can I {verb}?」で{verbJa}許可を求めます。'],
  ['Could you', '〜していただけますか', 'Could you {verb} now?', '「Could you {verb}?」で{verbJa}ことを丁寧に頼みます。'],
  ['I usually', '普段〜する', 'I usually {verb} in the morning.', '「I usually {verb}」で普段{verbJa}ことを伝えます。'],
  ['I have to', '〜しなければならない', 'I have to {verb} before noon.', '「I have to {verb}」で{verbJa}必要があることを伝えます。'],
]

verbs.forEach(([verb, verbJa], verbIndex) => {
  verbChunkPatterns.forEach(([prefix, meaningPattern, example, exampleJa], patternIndex) => {
    const phrase = `${prefix} ${verb}`
    const meaning = meaningPattern.replace('〜', verbJa)
    addVocab(
      `sentence-chunk-${phrase}`,
      phrase,
      `${meaning} (${verbJa})`,
      'phrase',
      example.replace('{verb}', verb),
      exampleJa.replaceAll('{verb}', verb).replaceAll('{verbJa}', verbJa),
      levels[(verbIndex + patternIndex) % levels.length],
    )
  })
})

const conversationalAdverbs = [
  ['always', 'いつも'],
  ['usually', 'たいてい'],
  ['often', 'よく'],
  ['sometimes', '時々'],
  ['never', '決して'],
  ['quickly', '素早く'],
  ['slowly', 'ゆっくり'],
  ['carefully', '注意深く'],
  ['easily', '簡単に'],
  ['really', '本当に'],
]

verbs.forEach(([verb, verbJa], verbIndex) => {
  conversationalAdverbs.forEach(([adverb, adverbJa], adverbIndex) => {
    const phrase = `${adverb} ${verb}`
    addVocab(
      `adverb-verb-${phrase}`,
      phrase,
      `${adverbJa}${verbJa}`,
      'phrase',
      `I ${adverb} ${verb}.`,
      `私は${adverbJa}${verbJa}ことがあります。`,
      levels[(verbIndex + adverbIndex) % levels.length],
    )
  })
})

verbFrames.forEach(([verb, object, meaningJa, exampleEn, exampleJa], index) => {
  addVocab(
    `chunk-${verb}-${object}`,
    `${verb} ${object}`,
    meaningJa,
    'phrase',
    exampleEn,
    exampleJa,
    levelForIndex(index + 1),
  )
})

const places = [
  ['home', '家'],
  ['work', '職場'],
  ['school', '学校'],
  ['the station', '駅'],
  ['the airport', '空港'],
  ['the hotel', 'ホテル'],
  ['the restaurant', 'レストラン'],
  ['the store', '店'],
  ['the office', 'オフィス'],
  ['the park', '公園'],
  ['the bank', '銀行'],
  ['the hospital', '病院'],
]
const placePatterns = [
  ['at', '〜で', 'I am at {en}.', '私は{ja}にいます。'],
  ['near', '〜の近くに', 'It is near {en}.', 'それは{ja}の近くにあります。'],
  ['next to', '〜の隣に', 'It is next to {en}.', 'それは{ja}の隣にあります。'],
  ['in front of', '〜の前に', 'I am in front of {en}.', '私は{ja}の前にいます。'],
  ['on the way to', '〜へ向かう途中で', 'I am on the way to {en}.', '私は{ja}へ向かう途中です。'],
  ['far from', '〜から遠い', 'It is far from {en}.', 'それは{ja}から遠いです。'],
]

places.forEach(([place, placeJa], placeIndex) => {
  placePatterns.forEach(([prefix, meaningPrefix, exampleEn, exampleJa], patternIndex) => {
    const phrase = `${prefix} ${place}`
    addVocab(
      `place-${phrase}`,
      phrase,
      `${placeJa}${meaningPrefix.replace('〜', '')}`,
      'phrase',
      exampleEn.replace('{en}', place),
      exampleJa.replace('{ja}', placeJa),
      levels[(placeIndex + patternIndex) % levels.length],
    )
  })
})

const timeWords = [
  ['this morning', '今朝'],
  ['this afternoon', '今日の午後'],
  ['this evening', '今晩'],
  ['tonight', '今夜'],
  ['tomorrow morning', '明日の朝'],
  ['next week', '来週'],
  ['next month', '来月'],
  ['last week', '先週'],
  ['last month', '先月'],
  ['every day', '毎日'],
  ['every weekend', '毎週末'],
  ['once a week', '週に一度'],
  ['twice a month', '月に二度'],
]
timeWords.forEach(([word, ja], index) => {
  addVocab(`time-${word}`, word, ja, 'phrase', `I will do it ${word}.`, `${ja}それをします。`, levelForIndex(index + 3))
})

const header = `-- Generated by scripts/generate-core-content.mjs.
-- Adds a larger daily-conversation vocabulary bank and grammar notebook items.
-- Safe to run multiple times.
`

function valuesSql(rows, columns) {
  return rows
    .map((row) => `  (${columns.map((column) => sql(row[column])).join(', ')})`)
    .join(',\n')
}

const grammarRows = grammarItems.map(([id, title, summary, pattern, level]) => ({
  id,
  title,
  summary,
  pattern,
  level,
}))

function takeVocabularyIds(predicate, count, offset = 0) {
  return vocabulary
    .filter((item) => predicate(item))
    .slice(offset, offset + count)
    .map((item) => item.id)
}

const coreCourses = [
  {
    id: 'core-beginner-essential-words',
    title: '日常会話の基本単語',
    level: 'Beginner',
    scene: 'Daily Conversation',
    description: '日常会話で最初に使う名詞・動詞・形容詞・副詞を7日間で固めます。',
    sortOrder: 101,
    dayTitles: ['身の回りの名詞', '毎日の動作', '状態を表す形容詞', '頻度と時間', '持ち物と場所', '会話の基本語', '基本語まとめ'],
    grammarIds: ['core-g-present-simple-question', 'core-g-present-simple-negative', 'core-g-be-question'],
    vocabIds: [
      ...takeVocabularyIds((item) => item.id.startsWith('core-noun-'), 42),
      ...takeVocabularyIds((item) => item.id.startsWith('core-verb-'), 28),
      ...takeVocabularyIds((item) => item.id.startsWith('core-adj-'), 14),
    ],
  },
  {
    id: 'core-beginner-sentence-chunks',
    title: '話すための基本チャンク',
    level: 'Beginner',
    scene: 'Daily Conversation',
    description: 'I need to、Can I、Could you など、会話でそのまま使える文のかたまりを練習します。',
    sortOrder: 102,
    dayTitles: ['必要を伝える', 'したいことを言う', '許可を求める', '丁寧に頼む', '普段の行動', '義務を伝える', 'チャンクまとめ'],
    grammarIds: ['core-g-need-to', 'core-g-can-i', 'core-g-could-you', 'core-g-have-to'],
    vocabIds: takeVocabularyIds((item) => item.id.startsWith('core-sentence-chunk-'), 84),
  },
  {
    id: 'core-elementary-place-travel',
    title: '場所と移動の語彙強化',
    level: 'Elementary',
    scene: 'Travel',
    description: '駅、ホテル、店、空港など、移動と場所説明に必要な語彙を増やします。',
    sortOrder: 103,
    dayTitles: ['場所を言う', '位置を説明する', '移動する', 'ホテル周辺', '街で探す', '安全と確認', '場所語彙まとめ'],
    grammarIds: ['core-g-there-question', 'core-g-how-much', 'core-g-indirect-question'],
    vocabIds: [
      ...takeVocabularyIds((item) => item.id.startsWith('core-place-'), 42),
      ...takeVocabularyIds((item) => item.id.startsWith('core-collocation-place-'), 42),
    ],
  },
  {
    id: 'core-elementary-work-info',
    title: '仕事と情報の語彙強化',
    level: 'Elementary',
    scene: 'Work',
    description: 'メール、会議、予定、問題、質問など、仕事や情報整理で使う語彙を増やします。',
    sortOrder: 104,
    dayTitles: ['メールと連絡', '会議と予定', '質問と回答', '問題を説明する', '資料と情報', '依頼と確認', '仕事語彙まとめ'],
    grammarIds: ['core-g-could-you', 'core-g-let-me', 'core-g-indirect-question'],
    vocabIds: [
      ...takeVocabularyIds((item) => item.id.startsWith('core-collocation-work-info-'), 60),
      ...takeVocabularyIds((item) => item.id.startsWith('core-chunk-'), 24),
    ],
  },
  {
    id: 'core-intermediate-collocations',
    title: '自然なコロケーション強化',
    level: 'Intermediate',
    scene: 'Daily Conversation',
    description: 'good question、important information のように、自然に組み合わせて使う語彙を練習します。',
    sortOrder: 105,
    dayTitles: ['持ち物の表現', '場所の表現', '食べ物の表現', '仕事の表現', '人を表す表現', '時間と予定', 'コロケーションまとめ'],
    grammarIds: ['core-g-comparative', 'core-g-too-enough', 'core-g-relative-where-when'],
    vocabIds: takeVocabularyIds((item) => item.id.startsWith('core-collocation-'), 84, 120),
  },
  {
    id: 'core-intermediate-fluency-chunks',
    title: '流暢さを上げる副詞チャンク',
    level: 'Intermediate',
    scene: 'Self Introduction',
    description: 'usually work、carefully check など、行動にニュアンスを足すチャンクを練習します。',
    sortOrder: 106,
    dayTitles: ['いつもすること', '時々すること', '素早くすること', '注意深くすること', '本当にすること', '簡単にできること', '副詞チャンクまとめ'],
    grammarIds: ['core-g-frequency-adverbs', 'core-g-present-perfect-since-for', 'core-g-used-to'],
    vocabIds: takeVocabularyIds((item) => item.id.startsWith('core-adverb-verb-'), 84),
  },
]

const courseRows = coreCourses.map((course) => ({
  id: course.id,
  title: course.title,
  level: course.level,
  scene: course.scene,
  description: course.description,
  durationDays: 7,
  sortOrder: course.sortOrder,
  isPublished: true,
}))

const courseDayRows = coreCourses.flatMap((course) =>
  course.dayTitles.map((title, index) => ({
    courseId: course.id,
    dayNumber: index + 1,
    title,
    objective: `${title}で使う語彙と文法を確認し、短い英文として使えるようにする。`,
    sortOrder: index + 1,
  })),
)

const courseGrammarRows = coreCourses.flatMap((course) =>
  Array.from({ length: 7 }, (_, dayIndex) =>
    course.grammarIds.map((grammarId, grammarIndex) => ({
      courseId: course.id,
      dayNumber: dayIndex + 1,
      grammarId,
      sortOrder: grammarIndex + 1,
    })),
  ).flat(),
)

const courseVocabularyRows = coreCourses.flatMap((course) =>
  Array.from({ length: 7 }, (_, dayIndex) =>
    course.vocabIds.slice(dayIndex * 12, dayIndex * 12 + 12).map((vocabularyId, vocabIndex) => ({
      courseId: course.id,
      dayNumber: dayIndex + 1,
      vocabularyId,
      sortOrder: vocabIndex + 1,
    })),
  ).flat(),
)

const courseExampleRows = coreCourses.flatMap((course) =>
  course.dayTitles.flatMap((title, index) => [
    {
      courseId: course.id,
      dayNumber: index + 1,
      sentenceEn: 'I can use these words in a short conversation.',
      sentenceJa: 'これらの単語を短い会話で使えます。',
      sortOrder: 1,
    },
    {
      courseId: course.id,
      dayNumber: index + 1,
      sentenceEn: 'Let me make one simple sentence with today’s vocabulary.',
      sentenceJa: '今日の語彙を使って簡単な文を一つ作ってみます。',
      sortOrder: 2,
    },
  ]),
)

const courseExerciseRows = coreCourses.flatMap((course) =>
  course.dayTitles.map((title, index) => ({
    courseId: course.id,
    dayNumber: index + 1,
    type: 'translate',
    promptJa: `${title}の語彙を一つ使って、短い英文を作ってください。`,
    answerEn: 'I can make a simple sentence.',
    choices: null,
    sortOrder: 1,
  })),
)

function valuesSqlFromColumns(rows, columns) {
  const valueSql = (row, [key, type]) => {
    const value = row[key]
    if (type === 'number') return String(value)
    if (type === 'boolean') return value ? 'true' : 'false'
    if (type === 'json') return value === null || value === undefined ? 'null' : sql(JSON.stringify(value))
    return sql(value)
  }

  return rows
    .map((row) => `  (${columns.map((column) => valueSql(row, column)).join(', ')})`)
    .join(',\n')
}

const generatedCourseIdsSql = coreCourses.map((course) => sql(course.id)).join(', ')

const contentSql = `${header}
insert into grammar_items (id, title, summary, pattern, level) values
${valuesSql(grammarRows, ['id', 'title', 'summary', 'pattern', 'level'])}
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  pattern = excluded.pattern,
  level = excluded.level,
  updated_at = now();

insert into vocabulary_items (id, word, meaning_ja, part_of_speech, example_en, example_ja, level) values
${valuesSql(vocabulary, ['id', 'word', 'meaningJa', 'partOfSpeech', 'exampleEn', 'exampleJa', 'level'])}
on conflict (id) do update set
  word = excluded.word,
  meaning_ja = excluded.meaning_ja,
  part_of_speech = excluded.part_of_speech,
  example_en = excluded.example_en,
  example_ja = excluded.example_ja,
  level = excluded.level,
  updated_at = now();

insert into courses (id, title, level, scene, description, duration_days, sort_order, is_published) values
${valuesSqlFromColumns(courseRows, [
  ['id'],
  ['title'],
  ['level'],
  ['scene'],
  ['description'],
  ['durationDays', 'number'],
  ['sortOrder', 'number'],
  ['isPublished', 'boolean'],
])}
on conflict (id) do update set
  title = excluded.title,
  level = excluded.level,
  scene = excluded.scene,
  description = excluded.description,
  duration_days = excluded.duration_days,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();

insert into course_days (course_id, day_number, title, objective, sort_order) values
${valuesSqlFromColumns(courseDayRows, [
  ['courseId'],
  ['dayNumber', 'number'],
  ['title'],
  ['objective'],
  ['sortOrder', 'number'],
])}
on conflict (course_id, day_number) do update set
  title = excluded.title,
  objective = excluded.objective,
  sort_order = excluded.sort_order;

delete from example_sentences es
using course_days cd
where es.course_day_id = cd.id
  and cd.course_id in (${generatedCourseIdsSql});

delete from exercises ex
using course_days cd
where ex.course_day_id = cd.id
  and cd.course_id in (${generatedCourseIdsSql});

delete from course_day_grammar cdg
using course_days cd
where cdg.course_day_id = cd.id
  and cd.course_id in (${generatedCourseIdsSql});

delete from course_day_vocabulary cdv
using course_days cd
where cdv.course_day_id = cd.id
  and cd.course_id in (${generatedCourseIdsSql});

insert into course_day_grammar (course_day_id, grammar_id, sort_order)
select cd.id, source.grammar_id, source.sort_order
from (values
${valuesSqlFromColumns(courseGrammarRows, [
  ['courseId'],
  ['dayNumber', 'number'],
  ['grammarId'],
  ['sortOrder', 'number'],
])}
) as source(course_id, day_number, grammar_id, sort_order)
join course_days cd
  on cd.course_id = source.course_id
 and cd.day_number = source.day_number;

insert into course_day_vocabulary (course_day_id, vocabulary_id, sort_order)
select cd.id, source.vocabulary_id, source.sort_order
from (values
${valuesSqlFromColumns(courseVocabularyRows, [
  ['courseId'],
  ['dayNumber', 'number'],
  ['vocabularyId'],
  ['sortOrder', 'number'],
])}
) as source(course_id, day_number, vocabulary_id, sort_order)
join course_days cd
  on cd.course_id = source.course_id
 and cd.day_number = source.day_number;

insert into example_sentences (course_day_id, sentence_en, sentence_ja, sort_order)
select cd.id, source.sentence_en, source.sentence_ja, source.sort_order
from (values
${valuesSqlFromColumns(courseExampleRows, [
  ['courseId'],
  ['dayNumber', 'number'],
  ['sentenceEn'],
  ['sentenceJa'],
  ['sortOrder', 'number'],
])}
) as source(course_id, day_number, sentence_en, sentence_ja, sort_order)
join course_days cd
  on cd.course_id = source.course_id
 and cd.day_number = source.day_number;

insert into exercises (course_day_id, type, prompt_ja, answer_en, choices, sort_order)
select cd.id, source.type, source.prompt_ja, source.answer_en, source.choices::jsonb, source.sort_order
from (values
${valuesSqlFromColumns(courseExerciseRows, [
  ['courseId'],
  ['dayNumber', 'number'],
  ['type'],
  ['promptJa'],
  ['answerEn'],
  ['choices', 'json'],
  ['sortOrder', 'number'],
])}
) as source(course_id, day_number, type, prompt_ja, answer_en, choices, sort_order)
join course_days cd
  on cd.course_id = source.course_id
 and cd.day_number = source.day_number;
`

mkdirSync(dirname(migrationPath), { recursive: true })
mkdirSync(dirname(seedPath), { recursive: true })
writeFileSync(migrationPath, contentSql)
writeFileSync(seedPath, contentSql)

console.log(`Generated ${grammarRows.length} grammar items`)
console.log(`Generated ${vocabulary.length} vocabulary items`)
console.log(migrationPath)
console.log(seedPath)
