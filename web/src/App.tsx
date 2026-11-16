import { useState, type ChangeEvent, type FormEvent } from 'react'
import './App.css'

function App() {
  // フォーム用ステート
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [startDate, setStartDate] = useState('2026-11-03')
  const [endDate, setEndDate] = useState('2026-11-14')
  const [eventDate, setEventDate] = useState('2026/11/14 (土) 10:00〜17:00')
  const [eventLocation, setEventLocation] = useState('学外展示会場（サンプル）')
  const [organization, setOrganization] = useState('学生プロジェクトチーム')
  const [contact, setContact] = useState('')

  // UI管理ステート
  const [page, setPage] = useState<'form' | 'review' | 'done'>('form')
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)


  // 画像選択処理
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImage(null)
      setImagePreview(null)
      setMessage('画像ファイルを選択してください。')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImage(null)
      setImagePreview(null)
      setMessage('画像のサイズは5MB以下にしてください。')
      event.target.value = ''
      return
    }

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setMessage('')
  }

  // 確認画面へ進む処理
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (!title.trim() || !description.trim() || !category) {
      setMessage('必須項目を入力してください。')
      return
    }

    if (!startDate || !endDate) {
      setMessage('掲載希望期間を選択してください。')
      return
    }

    if (endDate < startDate) {
      setMessage('掲載終了日は開始日以降の日付にしてください。')
      return
    }

    setPage('review')
    window.scrollTo(0, 0)
  }

  // 投稿確定処理
  const handleConfirm = () => {
    setPage('done')
    window.scrollTo(0, 0)
    console.log({
      title,
      category,
      description,
      image,
      startDate,
      endDate,
      eventDate,
      eventLocation,
      organization,
      contact,
    })
  }

  // 入力フォームのリセット
  const handleReset = () => {
    setTitle('')
    setCategory('学生の活動')
    setDescription('')
    setImage(null)
    setStartDate('')
    setEndDate('')
    setEventDate('')
    setEventLocation('')
    setOrganization('')
    setContact('')
    setMessage('')
    setPage('form')
    
    window.scrollTo(0, 0)
  }

  // 上部ステップナビゲーション
  const renderStepNav = () => (
    <nav className="step-nav" aria-label="申請ステップ">
      <div className={`step-item ${page === 'form' ? 'active' : ''}`}>
        1 入力する
      </div>
      <div className={`step-item ${page === 'review' ? 'active' : ''}`}>
        2 確認する
      </div>
      <div className={`step-item ${page === 'done' ? 'active' : ''}`}>
        3 申請完了
      </div>
    </nav>
  )

  // 1. 入力画面 (1 入力する)
  if (page === 'form') {
    return (
      <main className="app-container">
        <header className="page-header">
          <p className="header-tag">SHARE YOUR NEWS</p>
          <h1>
            あなたの活動を、
            <br />
            学内に届けよう。
          </h1>
          <p className="header-desc">
            伝えたいニュースを入力して、掲載を申請できます。
          </p>
        </header>

        {renderStepNav()}

        <section className="form-card">
          <p className="required-note">＊は入力が必要な項目です</p>

          <form onSubmit={handleSubmit}>
            {/* 1 伝えたいことを入力する */}
            <fieldset className="section-block">
              <legend className="section-title">1 本文を入力する</legend>

              <div className="form-group">
                <label htmlFor="title">
                  タイトル <span className="req">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="プロジェクト成果展示のお知らせ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  カテゴリ <span className="req">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="学生の活動">学生の活動</option>
                    <option value="イベント">イベント</option>
                    <option value="お知らせ">お知らせ</option>
                    <option value="研究成果">研究成果</option>
                  </select>
                </div>
                <p className="field-hint">
                  ニュースに合うカテゴリを選んでください。
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  伝えたいこと <span className="req">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="学生たちのアイデアと挑戦を、展示を通じて届けます。..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <p className="field-hint">
                  活動内容や参加方法を、具体的に書いてください。
                </p>
              </div>
            </fieldset>

            {/* 2 写真を選ぶ */}
            <fieldset className="section-block">
              <legend className="section-title">2 写真を選ぶ（任意）</legend>
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="プレビュー" />
                  <label htmlFor="image-input" className="btn-secondary mt-12">
                    画像を修正・変更する
                  </label>
                </div>
              ) : (
                <label htmlFor="image-input" className="btn-secondary">
                  画像を選択する
                </label>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={handleImageChange}
              />
              <p className="field-hint">画像がなくても申請できます。</p>
            </fieldset>

            {/* 3 掲載希望期間を選ぶ */}
            <fieldset className="section-block">
              <legend className="section-title">3 掲載希望期間を選ぶ</legend>

              <div className="form-group">
                <label htmlFor="startDate">
                  掲載開始日 <span className="req">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">
                  掲載終了日 <span className="req">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                <p className="field-hint">
                  イベントの開催日とは別に、情報を載せたい期間を選んでください。
                </p>
              </div>
            </fieldset>

            {/* 4 イベント情報を入力する */}
            <fieldset className="section-block">
              <legend className="section-title">4 イベント情報を入力する（任意）</legend>

              <div className="form-group">
                <label htmlFor="eventDate">開催日時</label>
                <input
                  id="eventDate"
                  type="text"
                  placeholder="2026/11/14 (土) 10:00〜17:00"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventLocation">会場</label>
                <input
                  id="eventLocation"
                  type="text"
                  placeholder="学外展示会場（サンプル）"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                />
              </div>
            </fieldset>

            {/* 5 投稿者情報を入力する */}
            <fieldset className="section-block">
              <legend className="section-title">5 投稿者情報を入力する（任意）</legend>

              <div className="form-group">
                <label htmlFor="organization">団体名・サークル名</label>
                <input
                  id="organization"
                  type="text"
                  placeholder="学生プロジェクトチーム"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
                <p className="field-hint">
                  入力した名前は、ニュースに表示されます。
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="contact">連絡先</label>
                <input
                  id="contact"
                  type="text"
                  placeholder="入力してください"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <p className="field-hint">
                  運営からの連絡に使用し、ニュースには表示されません。
                </p>
              </div>
            </fieldset>

            {message && <p className="error-message">{message}</p>}

            <p className="submit-note-text">
              掲載する内容と画像を確認してから申請してください。
            </p>

            <button type="submit" className="btn-primary">
              掲載イメージを確認する →
            </button>
          </form>
        </section>

        <section className="notice-card">
          <h3>運営の確認をお待ちください</h3>
          <p>
            内容を確認してから、Webとサイネージに掲載します。申請した時点では公開されません。
          </p>
        </section>

        <footer className="footer-note">
          ※ 入力内容はデザイン確認用のサンプルです。
        </footer>
      </main>
    )
  }

  // 2. 確認画面 (2 確認する)
  if (page === 'review') {
    return (
      <main className="app-container">
        <header className="page-header">
          <p className="header-tag">CHECK YOUR NEWS</p>
          <h1>掲載イメージを確認する</h1>
          <p className="header-desc">
            内容と見え方を確認して、掲載を申請してください。
          </p>
        </header>

        {renderStepNav()}

        {/* Webでの見え方 */}
        <section className="preview-card-section">
          <h2>Webでの見え方</h2>
          <div className="web-preview-box">
            {imagePreview && (
              <img src={imagePreview} alt="プレビュー" className="preview-img" />
            )}
            <div className="web-preview-body">
              <span className="badge-tag">{category}</span>
              <h3 className="preview-title">{title || 'タイトル未設定'}</h3>
              {organization && <p className="preview-org">{organization}</p>}
              <p className="preview-desc">{description}</p>
            </div>
          </div>
        </section>

        {/* サイネージでの見え方 */}
        <section className="preview-card-section">
          <h2>サイネージでの見え方</h2>
          <div className="signage-preview-box">
            <span className="badge-red">学内トピックス</span>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="サイネージプレビュー"
                className="preview-img"
              />
            )}
            <h3 className="preview-title">{title || 'タイトル未設定'}</h3>
            <p className="signage-sub">QRから、スマホで続きを読む</p>
          </div>
          <p className="field-hint mt-8">写真・タイトルを中心に表示します。</p>
        </section>

        <hr className="divider" />

        {/* 申請する内容詳細 */}
        <section className="review-details">
          <h2>申請する内容</h2>

          <div className="detail-item">
            <span className="detail-label">掲載希望期間</span>
            <p className="detail-val">
              {startDate} ～ {endDate}
            </p>
          </div>

          <div className="detail-item">
            <span className="detail-label">伝えたいこと</span>
            <p className="detail-val whitespace-pre">{description}</p>
          </div>

          {(eventDate || eventLocation) && (
            <div className="detail-item">
              <span className="detail-label">開催日時・会場</span>
              <p className="detail-val">{eventDate}</p>
              <p className="detail-val">{eventLocation}</p>
            </div>
          )}

          {organization && (
            <div className="detail-item">
              <span className="detail-label">投稿者・団体名</span>
              <p className="detail-val">{organization}</p>
            </div>
          )}

          <p className="field-hint">連絡先はニュースには表示されません。</p>

          <div className="notice-card inner-notice">
            <h3>運営の確認をお待ちください</h3>
            <p>
              内容を確認してから、Webとサイネージに掲載します。申請した時点では公開されません。
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary btn-full"
            onClick={() => {
              setPage('form')
              window.scrollTo(0, 0)
            }}
          >
            内容を修正する
          </button>

          <button
            type="button"
            className="btn-primary mt-12"
            onClick={handleConfirm}
          >
            掲載を申請する
          </button>
        </section>

        <footer className="footer-note mt-24">
          ※ 表示内容・画像はデザイン確認用のサンプルです。
        </footer>
      </main>
    )
  }

  // 3. 完了画面 (3 申請完了)
  return (
    <div className="dark-theme-wrapper">
      <main className="app-container">
        {renderStepNav()}

        <section className="done-card">
          <div className="done-check-icon" aria-hidden="true">
            ✓
          </div>
          <h2>
            掲載申請を
            <br />
            受け付けました
          </h2>
          <p className="done-desc">
            ニュースを届けてくれて、ありがとうございます。運営が内容を確認してから掲載します。
          </p>

          <hr className="divider-light" />

          <div className="next-flow">
            <h3>このあとの流れ</h3>
            <ol>
              <li>運営が内容を確認します</li>
              <li>必要に応じて修正をお願いします</li>
              <li>Webとサイネージに掲載します</li>
            </ol>
          </div>

          <div className="alert-box">
            <p>申請したニュースは、まだ公開されていません。</p>
          </div>

          <button type="button" className="btn-primary">
            トピックスを読む →
          </button>

          <button
            type="button"
            className="btn-secondary btn-full mt-12"
            onClick={handleReset}
          >
            続けてニュースを投稿する
          </button>
        </section>
      </main>
    </div>
  )
}

export default App