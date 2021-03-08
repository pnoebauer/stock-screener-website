import React from 'react';

function withFetch(WrappedComponent, url) {
    class WithFetch extends React.Component {
        
        render() {
            const { ...passThroughProps } = this.props;

            console.log(url,'url',passThroughProps,'...this.props')
            return (
                <WrappedComponent {...passThroughProps} />
            );
        }
    }
    return WithFetch;
} 


export default withFetch;