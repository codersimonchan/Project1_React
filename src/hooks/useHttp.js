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
  const [isLoading, setIsLoading] = useState(false);//在等待响应加载状态的情况
  const [error, setError] = useState();
// 每当我们提交，并关闭success modal时，可以使用此函数清理数据，使提交数据清空
  function clearData() {
    setData(initialData);
  }
// 在以下函数当中，调用sendHttpRequest，useCallback主要用于缓存sendRequest函数，useCallback 返回的是sendRequest函数引用，所以仍然可以传递data数据
// 函数缓存通常指的是通过某种方式将函数的计算结果存储起来，以便在后续的调用中直接返回缓存的结果，而不需要重新计算
// 而useCallback 缓存的是函数本身，是用来缓存函数的引用，而不是函数执行的结果
// 只要url（请求地址），config（请求数据）其中一个发生变化，useCallback里面的函数才会被重新创建，也就是函数的引用地址发生了变化
// 函数的引用地址发生了变化之后，才会触发useEffect里函数重新执行，从而触发调用此hook的组件重新渲染
// 如果函数的引用地址没有发生变化，那么就不会触发useEffect里函数重新执行，也就不会里面的状态变化，组件也就不会重新渲染
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
// 如果你在 useEffect 中使用了某个函数（比如 sendRequest 函数），并且这个函数的实现可能会在组件的重新渲染之间发生变化（比如函数的引用地址变化），
// 那么你应该将这个函数作为 useEffect 的依赖项。这样可以确保 useEffect 中使用的函数是最新的版本，避免因为函数的旧版本导致的 bug 或不一致的行为。
  useEffect(() => {
    // 如果请求方法是get，那么就自动发送请求，因为在此app中，get请求是加载meal页面时自动发送
    // 同时确保没有设置方法的空配置对象视为get请求
    // 如果是post提交请求，需要调用sendRequest进行发送
    if ((config && (config.method === 'GET' || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);
// 自定义钩子想法：最终返回一个对象，将请求的加载状态和错误状态公开给任何使用自定义钩子的组件
// 无论哪个组件调用钩子，都可以使用数据，请求的加载状态以及错误状态
  return {
    data,
    isLoading,
    error,
    sendRequest,//现在任何使用钩子的组件都可以在任何想调用地方调用sentRequest函数
    clearData,
  };
}
