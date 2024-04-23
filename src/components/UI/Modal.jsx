import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
// 导出模态框组件函数, className 可以保证此模态可以匹配不同样式
export default function Modal({ children, open, onClose, className = '' }) {
  // 定义一个reference，叫dialog，然后通过此dialog ref关联到一个元素
  const dialog = useRef();

  // 每当open属性发生变化时，effect函数就重新运行
  useEffect(() => {
    const modal = dialog.current;

    if (open) {
      // showModal是一个内置方法，可以在dialog对象上执行
      modal.showModal();
    }
// 清理函数
    return () => modal.close();
  }, [open]);

  // 将该组件要呈现的JSX内容作为参数1传递给createPortal，参数2是一个真正的DOM的元素，在index页面当中的元素
  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}
