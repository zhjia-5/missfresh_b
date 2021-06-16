import {getComponentRootDom} from "./";
import Icon from "@/components/Icon";
import styles from "@/styles/alertMessage.module.less";

/** 
 * 弹出消息
 * @param {String} content 消息内容
 * @param {String} type 消息类型：info fail success warn
 * @param {HTMLElement} container 容器，消息显示到该容器的正中，如果不传显示到页面中央
 * @param {Number} duration 多久消失
 * @param {Function} callback 成功的回调函数
*/
export default function (options = {}) {
  const content = options.content || "";
  const type = options.type || "info";
  const duration = options.duration || 2000;
  const container = options.container || document.body;

  // 创建弹框消息元素
  const div = document.createElement('div'),
    iconDom = getComponentRootDom(Icon, { type });//获取通过vue渲染出来的真实DOM元素
  // 将图标和文字放到弹框元素内 ，设置类名
  div.innerHTML = `
    <span class="${styles.icon}">${iconDom.outerHTML}</span>
    <div>${content}</div>
  `;

  // 设置样式 ,因为经过编译后的类名会变化，所以使用属性获取类名
  const typeClassName = styles[`message-${type}`];//类型样式名
  div.className = `${styles.message} ${typeClassName}`;

  // 判断容器的position是否改动过,如果没有就设置为relative（居中用）
  if(container !== document.body){//判断容器是否时body
    if(getComputedStyle(container).position === "static"){
      container.style.position = "relative";
    }
  }
  

  // 将div放入容器中
  container.appendChild(div);

  // 强行使浏览器渲染，导致reflow重排
  div.clientHeight;

  // 回归到正常位置
  div.style.opacity = 1;
  div.style.transform = `translate(-50%,-50%)`;

  // 等一段时间，消失
  setTimeout(()=>{
    div.style.opacity = 0;
    div.style.transform = `translate(-50%,-50%) translateY(-25px)`;
    div.addEventListener(
      "transitionend",
      function(){
        div.remove();
        options.callback && options.callback();// 如有有的话运行回调函数
      },
      {once:true}//该事件只添加一次
    );
  },duration);
}