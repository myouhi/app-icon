import React, { Component } from 'react';
import PropTypes from 'prop-types';
import drawOutline from './drawOutline';
import './Result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64: '',
        };
    }

    async componentDidMount() {
        const { data, resolution } = this.props;
        const isMobileScreen = window.innerWidth <= 620; 
        
        const base64 = await drawOutline(data, resolution, isMobileScreen);
        this.setState({
            base64,
        });
    }

    render() {
        const { data, resolution } = this.props;
        const { trackName, kind } = data;
        const { base64 } = this.state;
        
        const platformTag = kind.startsWith('mac') ? 'mac' : 'iOS'; 
        const displayPlatform = platformTag === 'mac' ? 'Mac 应用' : 'iOS 应用';

        return (
            <div className="result">
                <a href={base64} download={`${trackName}-${platformTag}-${resolution}x${resolution}.png`}>
                    <img className="icon" src={base64} alt={trackName} />
                </a>
                <div className="kind">{displayPlatform}</div>
                {trackName}
            </div>
        );
    }
}

Result.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Result;