import React from 'react';

// import { SYMBOLS } from '../../assets/constants';


function withFetch(WrappedComponent, urlRealTime, apikey) {
    class WithFetch extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isLoading: false,
                isError: false
            };
        }

        fetchRealTimeData = async (symbol, indicator) => {

            this.setState({
                isLoading: true,
                isError: false
            });
        
            const params = {apikey, symbol};
            
            const queryExt = new URLSearchParams(params).toString();
            const queryString = urlRealTime.concat('?', queryExt);
            
            try {
                const response = await fetch(queryString);
            
                if (!response.ok) {
                    const message = `An error has occured: ${response.status}`;
                    throw new Error(message);
                }
            
                const data = await response.json();
                // console.log(data);
                
                let indicatorObject = {};
                indicator.forEach(indicatorName => indicatorObject = {
                        ...indicatorObject,
                        [indicatorName]: symbol.map(symbolName => 
                            data[symbolName][indicatorName]
                        )
                    }
                )

                // console.log(indicatorObject,'indicatorObject');
                
                // const prices = symbol.map((symbolName, index) => {
                //     return data[symbolName][indicator];
                // });

                this.setState({
                    isLoading: false,
                    isError: false
                });

                // return prices;
                return indicatorObject;

            }
            catch (err) {
                this.setState({
                    isLoading: false,
                    isError: true // or pass the err itself
                });
            }
            
        }
        
        render() {
            const { ...passThroughProps } = this.props;

            // console.log(urlRealTime,'url',passThroughProps,'...this.props')
            return (
                <WrappedComponent 
                    {...this.state}
                    {...passThroughProps} 
                    fetchRealTimeData={this.fetchRealTimeData}
                />
            );
        }
    }
    return WithFetch;
} 


export default withFetch;