# 教室移動ナビ設計（Classroom Navigation）

## 1. 概要
- 目的: 授業終了時に次に行く教室をスマホで即時把握できるモバイル優先システムを提供する。
- 主な価値: 時間割参照の手間削減、遅刻減少、学生の移動効率向上。

## 2. 前提
- 学生はスマートフォンを常時所持（OS: iOS/Android）
- 学内にWi‑Fi/セルカバレッジあり（オフライン時は限定機能）
- 学校側が時間割・教室配置データを提供できること

## 3. ユーザーシナリオ（短く）
1. 学生が前の授業終了ボタンを押す/授業終了時刻に自動検知
2. アプリが次の授業を決定し、地図リンクまたは経路を提示
3. 学生はワンタップでナビ開始（校内地図 or 建物フロアマップ）

## 4. 主要機能（高レベル）
- 時間割の同期（学校配布CSV/API）
- 次授業の計算ロジック（現在時刻基準）
- 校内マップ表示（部屋位置、経路）
- 通知/リマインダ（授業終了数分前/次教室案内）
- 位置取得補助（Wi‑Fi/TLS/ビーコン/手動選択）
- 設定（学科/学年/建物優先）

## 5. MVP（最小実装）
- 機能:
  - ユーザーログイン（メール/学生ID）
  - 時間割取り込み（CSVアップロード or 管理画面登録）
  - "次の教室"をワンタップ表示（時刻基準、教室名＋建物名）
  - 校内マップは静的画像リンクで表示（簡易）
- 画面（UI要素）:
  - Home: 今日の時間割カード、次の授業カード（教室名・開始時刻）、『今終了』ボタン
  - Next Screen: 教室詳細（建物、階、地図リンク、経路開始ボタン）
- API/データスキーマ（抜粋）:
  - POST /auth/login -> { token }
  - GET /timetable?student_id= -> [{ class_id, start, end, room_id }]
  - POST /events/finished { student_id, class_id, timestamp } -> { next_class }
  - Room { id, name, building, floor, coords?, map_image_url }

## 6. 詳細：ユーザーフロー
1. 初回: 学生はログイン→時間割同期（自動 or CSV）
2. 授業の終了数分前にリマインド通知（オプション）
3. 授業終了時に『授業終了』ボタン押下 → クライアントが POST /events/finished を送信
4. APIは現在時刻と時間割で次クラスを検索、room情報を返す
5. クライアントは地図/画像を表示、経路案内（簡易）を提示

## 7. API仕様（例）
- POST /api/v1/auth/login
  - body: { student_id }
  - resp: { token }
- GET /api/v1/timetable?student_id=xxx&date=YYYY-MM-DD
  - resp: [{ id, class_name, start_time, end_time, room_id }]
- POST /api/v1/events/finished
  - body: { student_id, current_class_id?, timestamp }
  - resp: { next_class: { id, class_name, start_time, end_time, room: { name, building, floor, map_image_url } }, suggested_departure: "00:05" }

## 8. DBスキーマ（主要テーブル）
- students(id PK, name, email, student_no, created_at)
- timetables(id PK, class_name, start_time, end_time, room_id, group_id, date)
- rooms(id PK, name, building, floor, coords_lat, coords_lng, map_image_url)
- events(id PK, student_id, type, payload JSON, created_at)

## 9. 技術スタック（短期PoC / 将来）
- PoC: Node.js + Express, SQLite/Postgres, React (PWA) or Next.js, S3-compatibleストレージ, FCM
- スケール: Postgres managed, Docker + Kubernetes, CDN for地図画像, Redisキュー

## 10. プライバシー・セキュリティ考慮
- 位置情報は最小化（不要なら収集しない）
- JWTで認証、HTTPS常時
- ログ保持ポリシー（例: 90日）
- 学生の同意を得るUI（位置情報/通知）

## 11. テスト/受け入れ基準（MVP）
- ログイン→時間割同期が成功する
- 授業終了イベント送信で次授業が正しく返る（境界時刻を含む）
- 校内マップの表示/リンクが機能する
- 10名のパイロットで95%の正解率（次教室案内が合っている）

## 12. リスクと代替案
- 問題: 正確な教室座標がない
  - 代替: 建物＋階表示のみ、QRコード/掲示で位置特定
- 問題: 学生がスマホを持たない/使えない
  - 代替: 教室掲示のQRスキャン、案内キオスク

## 13. 次の実行ステップ（優先度付き）
1. ワイヤー（Home, Next, Map, Settings）作成（半日）
2. OpenAPI草案の作成（/auth, /timetable, /events）(半日)
3. DBスキーマ作成 & マイグレーション（半日）
4. PoC実装（バックエンド + PWA簡易UI）— 2週間スプリント
5. 小規模パイロット（1クラス）→ フィードバック反映

---
ファイル作成しました。次はOpenAPI定義の草案を作りますか？（はい/いいえ）
