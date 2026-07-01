-- English Study seed data: 2 full 7-day courses across different levels/scenes.

-- ============================================================
-- Courses
-- ============================================================

insert into courses (id, title, level, scene, description, duration_days, sort_order, is_published) values
  ('beginner-daily-conversation', 'はじめての日常英会話', 'Beginner', 'Daily Conversation', '自己紹介から日課、好きなものまで、日常でよく使う基本表現を7日間で学びます。', 7, 1, true),
  ('elementary-travel', '旅行で使う英会話', 'Elementary', 'Travel', '空港、ホテル、レストラン、ショッピングなど旅行先で役立つ表現を7日間で身につけます。', 7, 2, true);

-- ============================================================
-- Grammar items
-- ============================================================

insert into grammar_items (id, title, summary, pattern, level) values
  ('bdc-be-verb', 'be動詞の基本形', '主語によってam/is/areを使い分け、自分や相手の状態を伝える。', 'I am / You are / He is / She is', 'Beginner'),
  ('bdc-present-simple', '現在形(習慣)', '普段の習慣や事実を表すときは動詞の現在形を使う。主語がHe/She/Itのときは動詞にsをつける。', 'I get up at seven. / She gets up at seven.', 'Beginner'),
  ('bdc-like', 'likeを使った表現', 'likeの後ろに名詞や動名詞(-ing)を置いて好みを伝える。', 'I like coffee. / I like reading books.', 'Beginner'),
  ('bdc-going-to', 'be going to', '近い未来の予定や意図を表すときに使う。', 'I am going to meet a friend tomorrow.', 'Beginner'),
  ('bdc-can', 'canを使った可能表現', 'canの後ろに動詞の原形を置いて、能力や可能性を表す。', 'I can swim. / She can speak English.', 'Beginner'),
  ('bdc-past-simple', '過去形', '過去に起きたことを話すときは動詞を過去形にする。規則動詞は-edをつける。', 'I watched a movie yesterday.', 'Beginner'),
  ('trv-would-like', 'would like', '丁寧に希望を伝えるときに使う。I would like ~ (I''d like ~)', 'I would like a window seat.', 'Elementary'),
  ('trv-have-reservation', '予約について話す', 'have a reservationで予約していることを伝える。', 'I have a reservation under the name Tanaka.', 'Elementary'),
  ('trv-how-do-i-get', '道の尋ね方', 'How do I get to ~? で目的地までの行き方を尋ねる。', 'How do I get to the station?', 'Elementary'),
  ('trv-could-i-have', 'Could I have ~?', 'レストランなどで丁寧に注文するときの表現。', 'Could I have the menu, please?', 'Elementary'),
  ('trv-how-much', '値段の尋ね方', 'How much is/are ~? で値段を尋ねる。', 'How much is this?', 'Elementary'),
  ('trv-ive-lost', 'I''ve lost ~', '現在完了形で、物をなくした・トラブルが起きたことを伝える。', 'I''ve lost my wallet.', 'Elementary');

-- ============================================================
-- Vocabulary items
-- ============================================================

insert into vocabulary_items (id, word, meaning_ja, part_of_speech, example_en, example_ja, level) values
  ('bdc-hello', 'hello', 'こんにちは', 'interjection', 'Hello! How are you?', 'こんにちは、元気ですか？', 'Beginner'),
  ('bdc-name', 'name', '名前', 'noun', 'What is your name?', 'あなたの名前は何ですか？', 'Beginner'),
  ('bdc-nice', 'nice', '素敵な、良い', 'adjective', 'It is nice to meet you.', 'お会いできて嬉しいです。', 'Beginner'),
  ('bdc-meet', 'meet', '会う', 'verb', 'Nice to meet you.', 'はじめまして。', 'Beginner'),
  ('bdc-from', 'from', '〜から、〜出身', 'preposition', 'I am from Japan.', '私は日本出身です。', 'Beginner'),
  ('bdc-wake-up', 'wake up', '起きる', 'verb', 'I wake up at seven every day.', '私は毎日7時に起きます。', 'Beginner'),
  ('bdc-breakfast', 'breakfast', '朝食', 'noun', 'I eat breakfast at home.', '私は家で朝食を食べます。', 'Beginner'),
  ('bdc-work', 'work', '働く、仕事', 'verb', 'She works at a hospital.', '彼女は病院で働いています。', 'Beginner'),
  ('bdc-usually', 'usually', 'たいてい', 'adverb', 'I usually wake up early.', '私はたいてい早起きします。', 'Beginner'),
  ('bdc-everyday', 'every day', '毎日', 'adverb', 'She studies English every day.', '彼女は毎日英語を勉強します。', 'Beginner'),
  ('bdc-coffee', 'coffee', 'コーヒー', 'noun', 'I like drinking coffee.', '私はコーヒーを飲むのが好きです。', 'Beginner'),
  ('bdc-music', 'music', '音楽', 'noun', 'I like listening to music.', '私は音楽を聴くのが好きです。', 'Beginner'),
  ('bdc-movie', 'movie', '映画', 'noun', 'What is your favorite movie?', 'あなたの好きな映画は何ですか？', 'Beginner'),
  ('bdc-favorite', 'favorite', 'お気に入りの', 'adjective', 'This is my favorite song.', 'これは私のお気に入りの曲です。', 'Beginner'),
  ('bdc-hobby', 'hobby', '趣味', 'noun', 'What is your hobby?', 'あなたの趣味は何ですか？', 'Beginner'),
  ('bdc-tomorrow', 'tomorrow', '明日', 'noun', 'I am busy tomorrow.', '私は明日忙しいです。', 'Beginner'),
  ('bdc-plan', 'plan', '予定', 'noun', 'What is your plan for today?', '今日の予定は何ですか？', 'Beginner'),
  ('bdc-weekend', 'weekend', '週末', 'noun', 'I am going to visit my parents this weekend.', '今週末、両親を訪ねる予定です。', 'Beginner'),
  ('bdc-visit', 'visit', '訪ねる', 'verb', 'I want to visit Kyoto.', '私は京都を訪れたいです。', 'Beginner'),
  ('bdc-busy', 'busy', '忙しい', 'adjective', 'Are you busy tomorrow?', '明日は忙しいですか？', 'Beginner'),
  ('bdc-swim', 'swim', '泳ぐ', 'verb', 'I can swim very well.', '私はとても上手に泳げます。', 'Beginner'),
  ('bdc-cook', 'cook', '料理する', 'verb', 'I can cook Japanese food.', '私は日本料理を作ることができます。', 'Beginner'),
  ('bdc-drive', 'drive', '運転する', 'verb', 'I can drive a car.', '私は車を運転できます。', 'Beginner'),
  ('bdc-speak', 'speak', '話す', 'verb', 'She can speak a little English.', '彼女は少し英語を話せます。', 'Beginner'),
  ('bdc-a-little', 'a little', '少し', 'adverb', 'I can speak a little French.', '私は少しフランス語を話せます。', 'Beginner'),
  ('bdc-last-night', 'last night', '昨夜', 'noun', 'We had dinner last night.', '昨夜、私たちは夕食を食べました。', 'Beginner'),
  ('bdc-restaurant', 'restaurant', 'レストラン', 'noun', 'We had dinner at a nice restaurant.', '私たちは素敵なレストランで夕食を食べました。', 'Beginner'),
  ('bdc-delicious', 'delicious', 'おいしい', 'adjective', 'The meal was delicious.', 'その食事はおいしかったです。', 'Beginner'),
  ('bdc-fun', 'fun', '楽しいこと', 'noun', 'Last weekend was fun.', '先週末は楽しかったです。', 'Beginner'),
  ('trv-airport', 'airport', '空港', 'noun', 'We arrived at the airport early.', '私たちは早めに空港に着きました。', 'Elementary'),
  ('trv-passport', 'passport', 'パスポート', 'noun', 'Here is my passport.', 'こちらがパスポートです。', 'Elementary'),
  ('trv-ticket', 'ticket', 'チケット', 'noun', 'I have my ticket ready.', 'チケットは準備できています。', 'Elementary'),
  ('trv-window-seat', 'window seat', '窓側の席', 'noun', 'I would like a window seat.', '窓側の席をお願いします。', 'Elementary'),
  ('trv-luggage', 'luggage', '荷物', 'noun', 'I would like to check one bag of luggage.', '荷物を一つ預けたいです。', 'Elementary'),
  ('trv-hotel', 'hotel', 'ホテル', 'noun', 'We are staying at a hotel near the station.', '私たちは駅の近くのホテルに泊まります。', 'Elementary'),
  ('trv-reservation', 'reservation', '予約', 'noun', 'I have a reservation for two nights.', '2泊分の予約をしています。', 'Elementary'),
  ('trv-room', 'room', '部屋', 'noun', 'Can I see the room first?', '先に部屋を見せてもらえますか？', 'Elementary'),
  ('trv-key', 'key', '鍵', 'noun', 'Can I have the room key?', '部屋の鍵をいただけますか？', 'Elementary'),
  ('trv-check-in', 'check-in', 'チェックイン', 'noun', 'What time is check-in?', 'チェックインは何時ですか？', 'Elementary'),
  ('trv-station', 'station', '駅', 'noun', 'How do I get to the station?', '駅へはどう行けばいいですか？', 'Elementary'),
  ('trv-straight', 'straight', 'まっすぐ', 'adverb', 'Go straight and turn left.', 'まっすぐ行って左に曲がってください。', 'Elementary'),
  ('trv-turn-left', 'turn left', '左に曲がる', 'verb', 'Turn left at the corner.', '角を左に曲がってください。', 'Elementary'),
  ('trv-turn-right', 'turn right', '右に曲がる', 'verb', 'Turn right at the next light.', '次の信号を右に曲がってください。', 'Elementary'),
  ('trv-near', 'near', '近くに', 'preposition', 'Is there a convenience store near the station?', '駅の近くにコンビニはありますか？', 'Elementary'),
  ('trv-menu', 'menu', 'メニュー', 'noun', 'Could I have the menu, please?', 'メニューをいただけますか？', 'Elementary'),
  ('trv-order', 'order', '注文する', 'verb', 'Are you ready to order?', 'ご注文はお決まりですか？', 'Elementary'),
  ('trv-recommend', 'recommend', 'おすすめする', 'verb', 'What do you recommend?', '何がおすすめですか？', 'Elementary'),
  ('trv-bill', 'bill', 'お会計', 'noun', 'Could I have the bill, please?', 'お会計をお願いします。', 'Elementary'),
  ('trv-water', 'water', '水', 'noun', 'Can I have more water?', 'お水をもう一杯いただけますか？', 'Elementary'),
  ('trv-price', 'price', '値段', 'noun', 'What is the price of this jacket?', 'このジャケットの値段はいくらですか？', 'Elementary'),
  ('trv-discount', 'discount', '割引', 'noun', 'Is there a discount today?', '今日は割引はありますか？', 'Elementary'),
  ('trv-try-on', 'try on', '試着する', 'verb', 'Can I try this on?', '試着してもいいですか？', 'Elementary'),
  ('trv-size', 'size', 'サイズ', 'noun', 'Do you have this in size S?', 'これのSサイズはありますか？', 'Elementary'),
  ('trv-cash', 'cash', '現金', 'noun', 'Can I pay in cash?', '現金で払えますか？', 'Elementary'),
  ('trv-lost', 'lost', 'なくした', 'adjective', 'I''ve lost my wallet.', '財布をなくしました。', 'Elementary'),
  ('trv-help', 'help', '助け', 'noun', 'Can you help me, please?', '助けていただけますか？', 'Elementary'),
  ('trv-police', 'police', '警察', 'noun', 'Could you call the police?', '警察を呼んでもらえますか？', 'Elementary'),
  ('trv-emergency', 'emergency', '緊急事態', 'noun', 'This is an emergency.', 'これは緊急事態です。', 'Elementary'),
  ('trv-wallet', 'wallet', '財布', 'noun', 'I''ve lost my wallet.', '財布をなくしました。', 'Elementary'),
  ('trv-amazing', 'amazing', 'すばらしい', 'adjective', 'This trip was an amazing experience.', '今回の旅はすばらしい経験でした。', 'Elementary'),
  ('trv-experience', 'experience', '経験', 'noun', 'It was a great experience.', 'それは素晴らしい経験でした。', 'Elementary');

-- ============================================================
-- Course days: beginner-daily-conversation
-- ============================================================

insert into course_days (id, course_id, day_number, title, objective, sort_order) values
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'beginner-daily-conversation', 1, '自己紹介をする', '自分の名前や出身を伝える表現を身につける。', 1),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'beginner-daily-conversation', 2, '毎日の習慣を話す', '現在形で日課を伝える表現を身につける。', 2),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'beginner-daily-conversation', 3, '好きなものを伝える', 'likeを使って好みを話す表現を身につける。', 3),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'beginner-daily-conversation', 4, '予定をたずねる', 'be going toを使って未来の予定を話す表現を身につける。', 4),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'beginner-daily-conversation', 5, 'できることを話す', 'canを使って能力を伝える表現を身につける。', 5),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'beginner-daily-conversation', 6, '過去のできごとを話す', '過去形で昨日のことを伝える表現を身につける。', 6),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'beginner-daily-conversation', 7, '1週間のまとめ', 'これまで学んだ表現を使って自己紹介文を作る。', 7);

insert into course_day_grammar (course_day_id, grammar_id, sort_order) values
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'bdc-be-verb', 1),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'bdc-present-simple', 1),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'bdc-like', 1),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'bdc-going-to', 1),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'bdc-can', 1),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'bdc-past-simple', 1),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'bdc-be-verb', 1),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'bdc-present-simple', 2);

insert into course_day_vocabulary (course_day_id, vocabulary_id, sort_order) values
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'bdc-hello', 1),
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'bdc-name', 2),
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'bdc-nice', 3),
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'bdc-meet', 4),
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'bdc-from', 5),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'bdc-wake-up', 1),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'bdc-breakfast', 2),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'bdc-work', 3),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'bdc-usually', 4),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'bdc-everyday', 5),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'bdc-coffee', 1),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'bdc-music', 2),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'bdc-movie', 3),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'bdc-favorite', 4),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'bdc-hobby', 5),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'bdc-tomorrow', 1),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'bdc-plan', 2),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'bdc-weekend', 3),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'bdc-visit', 4),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'bdc-busy', 5),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'bdc-swim', 1),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'bdc-cook', 2),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'bdc-drive', 3),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'bdc-speak', 4),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'bdc-a-little', 5),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'bdc-last-night', 1),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'bdc-restaurant', 2),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'bdc-delicious', 3),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'bdc-fun', 4),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'bdc-favorite', 1),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'bdc-hobby', 2);

insert into example_sentences (course_day_id, sentence_en, sentence_ja, sort_order) values
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'Hello, my name is Yuta.', 'こんにちは、私の名前はゆうたです。', 1),
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'I am from Japan.', '私は日本出身です。', 2),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'I usually wake up at seven.', '私はたいてい7時に起きます。', 1),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'She works at a hospital.', '彼女は病院で働いています。', 2),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'I like listening to music.', '私は音楽を聴くのが好きです。', 1),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'What is your favorite movie?', 'あなたの好きな映画は何ですか？', 2),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'I am going to visit my parents this weekend.', '今週末、両親を訪ねる予定です。', 1),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'Are you busy tomorrow?', '明日は忙しいですか？', 2),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'I can cook Japanese food.', '私は日本料理を作ることができます。', 1),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'She can speak a little English.', '彼女は少し英語を話せます。', 2),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'I watched a movie yesterday.', '私は昨日映画を見ました。', 1),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'We had dinner at a nice restaurant last night.', '昨夜、素敵なレストランで夕食を食べました。', 2),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'This week I learned how to introduce myself.', '今週、私は自己紹介の仕方を学びました。', 1),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'I also learned how to talk about my daily life.', '毎日の生活について話す方法も学びました。', 2);

insert into exercises (course_day_id, type, prompt_ja, answer_en, choices, sort_order) values
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'translate', 'はじめまして、私の名前はケンです。', 'Nice to meet you, my name is Ken.', null, 1),
  ('9266d243-3687-4f5a-aa16-6172711db18d', 'choice', '「彼は学生です。」を選んでください。', 'He is a student.', '["He are a student.", "He is a student.", "He am a student."]', 2),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'translate', '私はたいてい7時に朝食を食べます。', 'I usually eat breakfast at seven.', null, 1),
  ('dcf633b1-0e1c-4698-956e-3b85b88539a8', 'fill_blank', '空欄を埋めてください: She ___ (study) every day.', 'studies', null, 2),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'translate', '私はコーヒーを飲むのが好きです。', 'I like drinking coffee.', null, 1),
  ('512427a0-b471-4d13-9d4f-ecb73d4f9ec3', 'choice', '「あなたの趣味は何ですか？」を選んでください。', 'What is your hobby?', '["What is your hobby?", "What do your hobby?", "What are your hobby?"]', 2),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'translate', '私は明日、友達に会う予定です。', 'I am going to meet a friend tomorrow.', null, 1),
  ('9ffa00ba-20e3-490c-88af-da28ee403019', 'choice', '「今週末何をする予定ですか？」を選んでください。', 'What are you going to do this weekend?', '["What are you going to do this weekend?", "What you are going to do this weekend?", "What going to you do this weekend?"]', 2),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'translate', '私は車を運転できます。', 'I can drive a car.', null, 1),
  ('360a9708-00a9-4f86-8218-cbd585f6909a', 'fill_blank', '空欄を埋めてください: He ___ swim very well.', 'can', null, 2),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'translate', '先週末は楽しかったです。', 'Last weekend was fun.', null, 1),
  ('e20c8f2e-bdd1-4685-a4bf-2f23042ef8e0', 'choice', '「その食事はおいしかったです。」を選んでください。', 'The meal was delicious.', '["The meal was delicious.", "The meal is delicious.", "The meal deliciously was."]', 2),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'translate', '今週、私は自己紹介の仕方を学びました。', 'This week, I learned how to introduce myself.', null, 1),
  ('6ae0913c-5159-4407-9ab1-30d27cc44230', 'choice', '「彼女は病院で働いています。」を選んでください。', 'She works at a hospital.', '["She works at a hospital.", "She work at a hospital.", "She working at a hospital."]', 2);

-- ============================================================
-- Course days: elementary-travel
-- ============================================================

insert into course_days (id, course_id, day_number, title, objective, sort_order) values
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'elementary-travel', 1, '空港でチェックインする', '空港でのやり取りに慣れる。', 1),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'elementary-travel', 2, 'ホテルにチェックインする', '宿泊先での基本表現を学ぶ。', 2),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'elementary-travel', 3, '道を尋ねる', '道案内の表現を使えるようにする。', 3),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'elementary-travel', 4, 'レストランで注文する', '旅行先での食事の注文表現を学ぶ。', 4),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'elementary-travel', 5, '買い物をする', 'ショッピングでの表現を学ぶ。', 5),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'elementary-travel', 6, 'トラブルに対応する', '困ったときの表現を学ぶ。', 6),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'elementary-travel', 7, '旅の思い出を話す', '旅行の感想を伝え、学んだ表現をまとめる。', 7);

insert into course_day_grammar (course_day_id, grammar_id, sort_order) values
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'trv-would-like', 1),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'trv-have-reservation', 1),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'trv-how-do-i-get', 1),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'trv-could-i-have', 1),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'trv-how-much', 1),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'trv-ive-lost', 1),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'trv-would-like', 1),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'trv-could-i-have', 2);

insert into course_day_vocabulary (course_day_id, vocabulary_id, sort_order) values
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'trv-airport', 1),
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'trv-passport', 2),
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'trv-ticket', 3),
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'trv-window-seat', 4),
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'trv-luggage', 5),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'trv-hotel', 1),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'trv-reservation', 2),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'trv-room', 3),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'trv-key', 4),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'trv-check-in', 5),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'trv-station', 1),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'trv-straight', 2),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'trv-turn-left', 3),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'trv-turn-right', 4),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'trv-near', 5),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'trv-menu', 1),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'trv-order', 2),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'trv-recommend', 3),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'trv-bill', 4),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'trv-water', 5),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'trv-price', 1),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'trv-discount', 2),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'trv-try-on', 3),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'trv-size', 4),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'trv-cash', 5),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'trv-lost', 1),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'trv-help', 2),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'trv-police', 3),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'trv-emergency', 4),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'trv-wallet', 5),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'trv-amazing', 1),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'trv-experience', 2);

insert into example_sentences (course_day_id, sentence_en, sentence_ja, sort_order) values
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'I would like a window seat, please.', '窓側の席をお願いします。', 1),
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'Here is my passport and ticket.', 'こちらがパスポートとチケットです。', 2),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'I have a reservation under the name Sato.', 'サトウの名前で予約しています。', 1),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'What time is check-in?', 'チェックインは何時ですか？', 2),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'How do I get to the museum?', '美術館へはどう行けばいいですか？', 1),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'Go straight and turn left.', 'まっすぐ行って左に曲がってください。', 2),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'Could I have the menu, please?', 'メニューをいただけますか？', 1),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'What do you recommend?', '何がおすすめですか？', 2),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'How much is this jacket?', 'このジャケットはいくらですか？', 1),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'Can I try this on?', '試着してもいいですか？', 2),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'I''ve lost my wallet.', '財布をなくしました。', 1),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'Can you help me, please?', '助けていただけますか？', 2),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'This trip was an amazing experience.', '今回の旅はすばらしい経験でした。', 1),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'I would like to visit again.', 'また訪れたいです。', 2);

insert into exercises (course_day_id, type, prompt_ja, answer_en, choices, sort_order) values
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'translate', '荷物を一つ預けたいです。', 'I would like to check one bag.', null, 1),
  ('6e66e5e7-03a1-45c8-9291-fc427a709033', 'choice', '「パスポートを見せてください。」を選んでください。', 'Can I see your passport?', '["Can I see your passport?", "Can I sees your passport?", "Can I seeing your passport?"]', 2),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'translate', '部屋の鍵をいただけますか？', 'Can I have the room key?', null, 1),
  ('8d575bb9-e601-410c-9851-c2b621a62bd9', 'fill_blank', '空欄を埋めてください: I have a ___ for two nights.', 'reservation', null, 2),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'translate', '駅の近くにコンビニはありますか？', 'Is there a convenience store near the station?', null, 1),
  ('d36f0931-a7d4-4a76-b165-cf597cf1ab91', 'choice', '「まっすぐ行ってください。」を選んでください。', 'Go straight.', '["Go straight.", "Go straightly.", "Going straight."]', 2),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'translate', 'お会計をお願いします。', 'Could I have the bill, please?', null, 1),
  ('c5c0ccc6-5cbc-41d7-82d3-5d892cada741', 'choice', '「お水をもう一杯いただけますか？」を選んでください。', 'Can I have more water?', '["Can I have more water?", "Can I has more water?", "Can I having more water?"]', 2),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'translate', 'これのSサイズはありますか？', 'Do you have this in size S?', null, 1),
  ('4fe82153-643c-496a-83f1-f5278b628888', 'fill_blank', '空欄を埋めてください: ___ much is this bag?', 'How', null, 2),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'translate', 'パスポートをなくしました。', 'I''ve lost my passport.', null, 1),
  ('5ac5b519-7917-4923-b88b-c16ae711b130', 'choice', '「警察を呼んでもらえますか？」を選んでください。', 'Could you call the police?', '["Could you call the police?", "Could you calling the police?", "Could you calls the police?"]', 2),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'translate', '今回の旅行はとても楽しかったです。', 'This trip was a lot of fun.', null, 1),
  ('80ae3845-96dc-4ae8-8145-2d4583d95c63', 'choice', '「また来たいです。」を選んでください。', 'I would like to visit again.', '["I would like to visit again.", "I would liking to visit again.", "I would likes to visit again."]', 2);
