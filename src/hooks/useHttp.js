import { useCallback, useEffect, useState } from 'react';
// 助手函数
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || 'Something went wrong, failed to send request.',
    );
  }

  return resData;
}
// 自定义钩子函数的特点是它们可以使用React的Hooks API，比如 useState、useEffect 等。
// 自定义钩子函数的命名通常以 "use" 开头，例如 useCustomHook。
export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);//在等待响应，加载状态的情况
  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }
// 在这个函数中，调用sendHttpRequest
// 在UI中反应这些不同的请求状态
  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
      } catch (error) {
        setError(error.message || 'Something went wrong!');
      }
      setIsLoading(false);
    },
    [url, config],
  );

  useEffect(() => {
    if ((config && (config.method === 'GET' || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}
