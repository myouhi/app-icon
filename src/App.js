import React, { Component } from 'react';
import Result from './Result';
import {
    expandShortLink,
    searchAppById,
    searchIosApp,
    searchMacApp,
} from './iTunes';
import search from './search.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            results: [],
            country: 'CN', 
            resolution: 512,
            isLoading: false,
        };
        this.search = this.search.bind(this);
        this.runAppSearch = this.runAppSearch.bind(this); 
    }
    
    componentDidMount() {
        this.search(); 
    }
    
    async runAppSearch(input, country) {
         try {
            const itunesReg = /^(http|https):\/\/itunes/;
            const idReg = /\/id(\d+)/i;
            const shortReg = /^(http|https):\/\/appsto/;
            let url = input;

            if (shortReg.test(input)) {
                url = await expandShortLink(input);
            }

            if (itunesReg.test(url) && idReg.test(url)) {
                const id = idReg.exec(url)[1];
                const data = await searchAppById(id, country);
                this.setState({ results: data.results });
            } else {
                const data = await Promise.all([
                    searchIosApp(input, country),
                    searchMacApp(input, country),
                ]);
                this.setState({
                    results: data[0].results.concat(data[1].results),
                });
            }
        } catch (err) {
            console.error("搜索失败:", err);
            this.setState({ results: [] });
        }
    }


    async search(defaultTerm = '') {
        let { input, country } = this.state;
        
        const isInitialSearch = !input.trim();
        input = input.trim() || '微信'; 
        
        this.setState({ isLoading: true, results: [] });

        try {
            await this.runAppSearch(input, country);
        } finally {
            this.setState({ isLoading: false }); 
        }

        if (isInitialSearch) {
             this.setState({ input: '' });
        }
    }

    render() {
        const { input, results, country, resolution, isLoading } = this.state;
        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="logo">高清图标</div>
                        <div className="description">
                            从 App Store 获取高清图标
                        </div>
                        <div className="options">
                            国家/地区：
                            <label
                                onClick={() => this.setState({ country: 'CN' })}
                            >
                                <input
                                    name="store"
                                    type="radio"
                                    checked={country === 'CN'}
                                />中国大陆
                            </label>
                            <label
                                onClick={() => this.setState({ country: 'US' })}
                            >
                                <input
                                    name="store"
                                    type="radio"
                                    checked={country === 'US'}
                                />美国
                            </label>
                            <label
                                onClick={() => this.setState({ country: 'JP' })}
                            >
                                <input
                                    name="store"
                                    type="radio"
                                    checked={country === 'JP'}
                                />日本
                            </label>
                        </div>
                        <div className="options">
                            图片分辨率：
                            <label
                                onClick={() =>
                                    this.setState({ resolution: 512 })
                                }
                            >
                                <input
                                    name="resolution"
                                    type="radio"
                                    checked={resolution === 512}
                                />
                                512x512
                            </label>
                            <label
                                onClick={() =>
                                    this.setState({ resolution: 1024 })
                                }
                            >
                                <input
                                    name="resolution"
                                    type="radio"
                                    checked={resolution === 1024}
                                />
                                1024x1024
                            </label>
                        </div>
                        <div className="search">
                            <input
                                className="search-input"
                                placeholder="iTunes 链接或应用名称"
                                value={input}
                                onChange={(e) =>
                                    this.setState({ input: e.target.value })
                                }
                                onKeyDown={(e) =>
                                    e.keyCode === 13 ? this.search() : ''
                                }
                            />
                            <div
                                className="search-button"
                                onClick={() => this.search()}
                            >
                                <img
                                    src={search}
                                    className="search-icon"
                                    alt="search"
                                />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="results">
                    {isLoading ? (
                        <div className="loading-spinner-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        results.map((result) => (
                            <Result
                                key={result.trackId}
                                data={result}
                                resolution={resolution}
                            />
                        ))
                    )}
                </main>
            </div>
        );
    }
}

export default App;