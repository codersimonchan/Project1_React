import { useContext } from 'react';
// 在React中，你使用 import 来引入模块,是一种静态加载
import Button from './UI/Button.jsx';
// 一个点表示当前目录，两个dot表示上级目录
import logoImg from '../assets/logo.jpg';
import CartContext from '../store/CartContext.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
// export 用于导出组件、函数、变量或常量，使其可以在其他文件中被引用和使用
// export default 用于导出默认值，一个模块只能有一个默认导出, import 时候可以直接重命名
// export 用于导出具名的函数、变量或常量，可以有多个导出项, 在import时需要{}进行包裹，里里面使用as关键字可以重命名
export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="A restaurant" />
        <h1>ReactFood</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
