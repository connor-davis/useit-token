import React, { Component } from "react";
import ReactDOM from "react-dom";
import jsQR from "jsqr";
import { Link } from "react-router-dom";

class ScanUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            scanData: {},
            scanComplete: false,
            currentUser: {},
        }

        this.scanner = React.createRef();
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
                video: {
                    facingMode: 'environment',
                    width: 1024,
                    height: 1024
                }
            }, handle, error => {
                console.log(error);
            });
        }
    }

    async componentDidMount() {
        let users = Object.values(this.props.users);

        users.map(async (u) => {
            this.setState({
                users: [...this.state.users, u]
            })
        })


        this.initScan();
    }

    render() {
        return (
            <div>
                <div className="d-scanner">
                    {this.state.scanComplete ?
                        <div className="d-scanner-data">
                            <div className="d-data-title">{this.state.scanData.fullName}</div>
                            <table className="d-table">
                                <thead className="d-table-head">
                                    <tr className="d-table-row">
                                        <th className="d-table-column">ID Number</th>
                                        <th className="d-table-column">Ward Number</th>
                                        <th className="d-table-column">Address</th>
                                        <th className="d-table-column">Phone Number</th>
                                        <th className="d-table-column">Balance</th>
                                    </tr>
                                </thead>

                                <tbody className="d-table-body">
                                    <tr className="d-table-row">
                                        <td className="d-table-column">{this.state.scanData.idNumber}</td>
                                        <td className="d-table-column">{this.state.scanData.wardNumber}</td>
                                        <td className="d-table-column">{this.state.scanData.address}</td>
                                        <td className="d-table-column">{this.state.scanData.phoneNumber}</td>
                                        <td className="d-table-column">{this.state.scanData.balance ? this.state.scanData.balance : 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <Link to="/" className="d-btn d-btn-primary">Back</Link>
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

export default ScanUser;