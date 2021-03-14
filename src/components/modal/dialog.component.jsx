import React from 'react';

const Dialog = props => {
    const animation =
      (props.animationType === 'enter'
        ? props.enterAnimation
        : props.leaveAnimation) || props.animation;
  
    const className = `rodal-dialog rodal-${animation}-${props.animationType}`;
  
    const CloseButton = props.showCloseButton ? (
      <span
        className="rodal-close"
        onClick={props.onClose}
        tabIndex={0}
      />
    ) : null;
  
    const { width, height, measure, duration, customStyles } = props;
  
    const style = {
      width: width + measure,
      height: height + measure,
      animationDuration: duration + 'ms',
      WebkitAnimationDuration: duration + 'ms'
    };
  
    const mergedStyles = { ...style, ...customStyles };
  
    return (
      <div style={mergedStyles} className={className}>
        {props.children}
        {CloseButton}
      </div>
    );
  };

export default Dialog;