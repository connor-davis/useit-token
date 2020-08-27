import React, { Component } from "react";
import { Link } from "react-router-dom";
import QRious from "qrious";
import saveAs from "file-saver";
import UseItLogo from "./assets/useit_logo.png";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                fullName: "",
                phoneNumber: "",
                address: "",
                wardNumber: "",
                idNumber: "",
            },
            userCreated: false
        }

        this.handleFullnameChange = this.handleFullnameChange.bind(this);
        this.handlePhonenumberChange = this.handlePhonenumberChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleWardNumberChange = this.handleWardNumberChange.bind(this);
        this.handleIDnumberChange = this.handleIDnumberChange.bind(this);
    }

    handleFullnameChange(e) {
        this.setState({
            user: {
                ...this.state.user,
                fullName: e.target.value
            }
        });
    }
    handlePhonenumberChange(e) {
        this.setState({
            user: {
                ...this.state.user,
                phoneNumber: e.target.value
            }
        });
    }
    handleAddressChange(e) {
        this.setState({
            user: {
                ...this.state.user,
                address: e.target.value
            }
        });
    }
    handleIDnumberChange(e) {
        this.setState({
            user: {
                ...this.state.user,
                idNumber: e.target.value
            }
        });
    }
    handleWardNumberChange(e) {
        this.setState({
            user: {
                ...this.state.user,
                wardNumber: e.target.value
            }
        });
    }

    canvasRadius(ctx, x, y, w, h, tl, tr, br, bl) {
        var r = x + w,
            b = y + h;

        ctx.beginPath();
        ctx.moveTo(x + tl, y);
        ctx.lineTo(r - (tr), y);
        ctx.quadraticCurveTo(r, y, r, y + tr);
        ctx.lineTo(r, b - br);
        ctx.quadraticCurveTo(r, b, r - br, b);
        ctx.lineTo(x + bl, b);
        ctx.quadraticCurveTo(x, b, x, b - bl);
        ctx.lineTo(x, y + tl);
        ctx.quadraticCurveTo(x, y, x + tl, y);
        ctx.fill();
        ctx.stroke();

    }

    generateUser() {
        const qrDiv = document.getElementById("qr-div");
        const cardDiv = document.getElementById("card-div");
        const logo = new Image();
        logo.src = UseItLogo;

        setInterval(() => {
            const data = JSON.stringify({ idNumber: this.state.user.idNumber, fullName: this.state.user.fullName });

            new QRious({
                element: qrDiv,
                value: data
            });

            const qrSize = 100;

            if (cardDiv instanceof HTMLCanvasElement && qrDiv instanceof HTMLCanvasElement) {
                const ctxCard = cardDiv.getContext("2d");
                const ctxQR = qrDiv.getContext("2d");

                ctxCard.canvas.width = 315;
                ctxCard.canvas.height = 195;

                const fullname = this.state.user.fullName.toUpperCase().split(" ") || "";
                const name = (fullname[0] ? fullname[0] : "john") + " " + (fullname[1] ? fullname[1] : "doe");

                ctxCard.clearRect(0, 0, ctxCard.canvas.width, ctxCard.canvas.height);

                ctxCard.fillStyle = "gainsboro";
                ctxCard.strokeStyle = "gainsboro";

                this.canvasRadius(ctxCard, 0, 0, ctxCard.canvas.width, ctxCard.canvas.height, 15, 15, 15, 15);

                ctxCard.drawImage(ctxQR.canvas, (ctxCard.canvas.width - qrSize) * 0.9, (ctxCard.canvas.height - qrSize) * 0.5, qrSize, qrSize);
                ctxCard.drawImage(logo, 20, (ctxCard.canvas.height * 0.15), 30, 30);

                ctxCard.font = "15px Arial";
                ctxCard.fillStyle = "mediumseagreen";

                ctxCard.fillText("USE-IT", 60, (ctxCard.canvas.height * 0.2));
                ctxCard.fillText("TOKEN CARD", 60, (ctxCard.canvas.height * 0.2) + 20);
                ctxCard.fillText(name.toUpperCase(), 20, ctxCard.canvas.height * 0.9)
            }
        });

        if (this.state.user.idNumber) {
            this.props.onCreate(this.state.user);

            cardDiv.style.display = "block";

            this.setState({
                userCreated: true
            });
        }
    }

    exportUser() {
        const cardDiv = document.getElementById("card-div");
        if (cardDiv instanceof HTMLCanvasElement) {
            cardDiv.toBlob((blob) => {
                saveAs(blob, this.state.user.idNumber + ".jpg");
            });
        }
    }

    async componentDidMount() {
        this.generateUser();
    }

    render() {
        return (
            <div className="d-center d-form">
                <h1 className="d-content-title">Create User</h1>
                <canvas id="qr-div" width={256} height={256} className="d-qr-canvas" style={{ display: "none" }} />
                <canvas id="card-div" className="d-card-canvas" style={{ display: "none" }} />
                {this.state.userCreated ?
                    <div className="d-create-user-form">
                        <div className="d-btn d-btn-primary d-btn-block" onClick={this.exportUser.bind(this)}>Export</div>
                        <Link to="/" className="d-btn d-btn-primary d-btn-block d-scanner-initbutton">Back</Link>
                    </div> :
                    <div className="d-create-user-form">
                        <div className="d-input-group">
                            <input className="d-input" placeholder="Full Name" value={this.state.user.fullName} onChange={this.handleFullnameChange} />
                            <input className="d-input" placeholder="Phone Number" value={this.state.user.phoneNumber} onChange={this.handlePhonenumberChange} />
                            <input className="d-input" placeholder="Address" value={this.state.user.address} onChange={this.handleAddressChange} />
                            <input className="d-input" placeholder="Ward Number" value={this.state.user.wardNumber} onChange={this.handleWardNumberChange} />
                            <input className="d-input" placeholder="ID Number" value={this.state.user.idNumber} onChange={this.handleIDnumberChange} />
                        </div>

                        <div className="d-row">
                            <div className="d-btn d-btn-primary" onClick={this.generateUser.bind(this)}>Create</div>
                            <Link to="/" className="d-btn d-btn-primary">Back</Link>
                        </div>
                    </div>}
            </div>
        );
    }
}

export default Home;