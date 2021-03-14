// https://github.com/chenjiahan/rodal

import React from 'react';

import Dialog from './dialog.component';

// env
const IN_BROWSER = typeof window !== 'undefined';
const UA = IN_BROWSER && window.navigator.userAgent.toLowerCase();
const IS_IE_9 = UA && UA.indexOf('msie 9.0') > 0;


class Modal extends React.Component {

  constructor(props) {
      super(props);
      this.popup = React.createRef();
      this.state = {
        isShow: false,
        animationType: 'leave'
      };
  }
  
  componentDidMount() {
    if (this.props.visible) {
      this.enter();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.enter();
    }
    if (!this.props.visible && prevProps.visible) {
      this.leave();
    }
  }

  enter() {
    this.setState({ isShow: true, animationType: 'enter' });
  }

  leave() {
    this.setState(IS_IE_9 ? { isShow: false } : { animationType: 'leave' });
  }

  onKeyUp = event => {
    if (!this.props.closeOnEsc || event.keyCode !== 27) { //closeOnEsc is off or clicked key is not ESC
      return;
    }

    this.props.onClose(event);
  };

  animationEnd = event => {
    const { animationType } = this.state;
    const { closeOnEsc, onAnimationEnd } = this.props;

    if (animationType === 'leave') {
      this.setState({ isShow: false });
    } else if (closeOnEsc) {
      this.popup.current.focus();
    //   this.el.focus();
    }
    // console.log('end',event.target === this.popup.current, onAnimationEnd)
    
    // if (event.target === this.el && onAnimationEnd) {
    if (event.target === this.popup.current && onAnimationEnd) {
        // console.log('end')
      onAnimationEnd();
    }
  };

  render() {
    const {
      closeMaskOnClick,
      onClose,
      customMaskStyles,
      showMask,
      duration,
      className,
      children
    } = this.props;

    const { isShow, animationType } = this.state;

    const Mask = showMask ? (
      <div
        className="rodal-mask"
        style={customMaskStyles}
        onClick={closeMaskOnClick ? onClose : void 0}
      />
    ) : null;

    const style = {
      display: isShow ? '' : 'none',
      animationDuration: duration + 'ms',
      WebkitAnimationDuration: duration + 'ms'
    };

    // console.log({...this.props},'{...this.props}')

    return (
      <div
        style={style}
        className={`rodal rodal-fade-${animationType} ${className}`}
        onAnimationEnd={this.animationEnd}
        tabIndex="-1"
        ref={this.popup}
        // ref={ref => { this.el = ref; }}
        onKeyUp={this.onKeyUp}
      >
        {Mask}
        <Dialog {...this.props} animationType={animationType}>
          {children}
        </Dialog>
      </div>
    );
  }
}

Modal.defaultProps = {
  width: 400,
  height: 240,
  measure: 'px',
  visible: false,
  showMask: true,
  closeOnEsc: true,
  closeMaskOnClick: true,
  showCloseButton: true,
  animation: 'slideUp',
  enterAnimation: 'fade',
  leaveAnimation: 'rotate',
  duration: 1300,
  className: '',
  customStyles: {},
  customMaskStyles: {}
};

export default Modal;