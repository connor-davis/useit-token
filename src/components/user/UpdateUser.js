import React, { Component } from "react";
import ReactDOM from "react-dom";
import jsQR from "jsqr";
import { Link } from "react-router-dom";

class Update extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            products: [],
            scanData: {},
            scanComplete: false,
        }
    }

    initScan() {
        const node = ReactDOM.findDOMNode(this);

        const handle = async (stream) => {
            if (stream instanceof MediaStream) {
                const child = node.querySelector(".d-scanner-video");

                if (child instanceof HTMLVideoElement) {
                    child.srcObject = stream;
                }

                const canvas = node.querySelector("#d-scanner-canvas");

                if (canvas instanceof HTMLCanvasElement) {
                    const ctx = canvas.getContext("2d");

                    const ticker = setInterval(() => {
                        ctx.drawImage(child, 0, 0, canvas.width, canvas.height);

                        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

                        const qr = jsQR(image.data, image.width, image.height, {});

                        if (qr) {
                            const matchData = JSON.parse(qr.data) || atob(JSON.parse(qr.data));

                            const userFound = this.state.users.filter(u => u.idNumber === matchData.idNumber)[0];

                            if (userFound) {
                                clearInterval(ticker);

                                this.setState({
                                    scanData: userFound,
                                    scanComplete: true,
                                });
                            } else {
                                this.setState({
                                    scanComplete: false
                                });
                            }
                        }
                    });
                }
            }
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
            }, handle, error => {
                console.log(error);
            });
        }
    }

    updateUserBalance() {
        const select = document.getElementById("d-select");
        if (select instanceof HTMLSelectElement) {
            const product = select[select.selectedIndex].text;

            const match = this.state.products.filter(p => p.productName === product.productName)[0];

            const data = this.state.scanData;

            data.balance = 10;

            this.props.onUpdate(data);
        }
    }

    componentDidMount() {
        let users = Object.values(this.props.users);

        if (users !== undefined) users.map(u => {
            this.setState({
                users: [...this.state.users, u]
            })
        })

        let products = Object.values(this.props.products);

        if (products !== undefined) this.setState({
            products: [...products]
        })

        this.initScan();
    }

    render() {
        return (
            <div>
                <div className="d-scanner">
                    {this.state.scanComplete ?
                        <div>
                            {this.state.products !== [] ? <div>
                                <h1 className="d-content-title">{this.state.scanData.fullName}</h1>
                                <div className="d-create-user-form">
                                    <div className="d-row">
                                        <div className="d-column">
                                            <input type="text" className="d-input" placeholder="KG" />
                                        </div>
                                        <div className="d-column">
                                            <select id="d-select" className="d-select">
                                                {this.state.products.map(p => <option value={p.productID}>{p.productName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-row">
                                        <div className="d-btn d-btn-primary" onClick={this.updateUserBalance.bind(this)}>Update Balance</div>
                                        <Link to="/" className="d-btn d-btn-primary">Back</Link>
                                    </div>
                                </div>
                            </div> : <h1 className="d-content-title">No Products</h1>}
                        </div> :
                        <div className="d-scanner">
                            <div className="d-scanner-video-wrapper">
                                <video autoPlay={true} id="d-scanner-video" className="d-scanner-video" style={{ display: "none" }}></video>
                                <canvas width={200} height={200} id="d-scanner-canvas"></canvas>
                            </div>
                            <Link to="/" className="d-btn d-btn-primary">Back</Link>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Update;