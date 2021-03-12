import React from 'react';

import { SYMBOLS } from '../../../assets/constants';


function withFetch(WrappedComponent, urlRealTime, apikey) {
    class WithFetch extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                data: [],
                isLoading: false,
                isError: false
            };
        }

        fetchRealTimeData = async (urlRealTime, symbol) => {
            // console.log('fetch')

            this.setState({
                data: [],
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
                    // console.log(data)
                    // this.setState({
                    //     data,
                    //     isLoading: false,
                    //     isError: false
                    // });
                    
                    const prices = symbol.map((symbolName, index) => {
                        return data[symbolName].lastPrice;
                    });

                    this.setState({
                        data: prices,
                        isLoading: false,
                        isError: false
                    });

                    return data;

                }
                catch (err) {
                    this.setState({
                        isLoading: false,
                        isError: true // or pass the err itself
                    });
                }
            
        }

        componentDidMount() {
            console.log('withFetch mounted')
            if(urlRealTime) {
                this.fetchRealTimeData(urlRealTime, SYMBOLS.slice(0,1))
                // .then(data => console.log(data,'data'))
            };

            
        }
        
        render() {
            const { ...passThroughProps } = this.props;

            console.log(urlRealTime,'url',passThroughProps,'...this.props')
            return (
                <WrappedComponent 
                    {...this.state}
                    {...passThroughProps} 
                    getData={this.fetchRealTimeData}
                
                />
            );
        }
    }
    return WithFetch;
} 


export default withFetch;