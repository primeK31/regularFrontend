import React from 'react';

const Loading = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p className="loading-text text-sm">Получаем ответ от ИИ</p>
    </div>
  );
};

export default Loading;
