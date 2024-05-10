import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Импортируем список языков
import LANGS from './lang.json';

function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('auto-detect');
  const [toLanguage, setToLanguage] = useState('en');
  const [charCount, setCharCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTextChange = (e) => {
    const text = e.target.value;
    setSourceText(text);
    setCharCount(text.length);
  };

  const translate = async () => {
    if (!sourceText) {
      setErrorMessage('Введите текст для перевода!');
      return;
    }

    try {
      const response = await axios.post(
        'https://translateappserver-5000.onrender.com/translate',
        {
          text: sourceText,
          from: fromLanguage,
          to: toLanguage,
        }
      );

      setTranslatedText(response.data.translation);
    } catch (error) {
      setErrorMessage('Ошибка при переводе текста. Попробуйте еще раз.');
      console.error('Ошибка при переводе текста:', error);
    }
  };

  const copyToClipboard = () => {
    if (!translatedText) {
      setErrorMessage('Нет текста для копирования!');
      return;
    }

    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000); // Скрыть сообщение через 3 секунды
      })
      .catch((error) => {
        setErrorMessage('Ошибка при копировании текста.');
        console.error('Ошибка при копировании текста:', error);
      });
  };

  return (
    <div className="container">
      <div className="input-container">
        <div className="textarea_row">
          <select
            className="select"
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
          >
            {/* Итерируемся по списку языков */}
            {Object.entries(LANGS).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <div className="char-count">{charCount}/100</div>
        </div>
        <textarea
          className="textarea"
          value={sourceText}
          onChange={handleTextChange}
          placeholder="Введите текст для перевода"
          maxLength={100}
        ></textarea>
        <button className="button" onClick={translate}>
          Перевести
        </button>
      </div>
      <div className="output-container">
        <select
          className="select"
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
        >
          {/* Итерируемся по списку языков */}
          {Object.entries(LANGS).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <div className="translated-text">{translatedText}</div>
        <div className="translate_row">
          <button className="button" onClick={copyToClipboard}>
            Копировать
          </button>
          <div className="translated-to">
            Переведено на: {LANGS[toLanguage]}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {copySuccess && (
            <div className="copy-success-message">
              Перевод скопирован в буфер обмена!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
