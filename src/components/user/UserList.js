import React, { Component } from "react";
import QRious from "qrious";
import saveAs from "file-saver";
import UseItLogo from "./assets/useit_logo.png";
import { Link } from "react-router-dom";

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
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

    exportToExcel() {
        var tableToExcel = (function () {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name) {
                if (!table.nodeType) table = document.getElementById(table)
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML, filename: name }

                const filename = name + ".xlsx";

                const data = uri + base64(format(template, ctx));
                const downloadLink = document.createElement("a");

                document.body.appendChild(downloadLink);

                downloadLink.href = data;
                downloadLink.download = filename;
                downloadLink.click();
            }
        })()

        tableToExcel("d-table", "data-" + Date.now());
    }

    exportUser(userdata) {
        const qrDiv = document.getElementById("qr-div");
        const cardDiv = document.getElementById("card-div");
        const logo = new Image();
        logo.src = UseItLogo;

        const data = JSON.stringify({ idNumber: userdata.idNumber, fullName: userdata.fullName });

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

            const fullname = userdata.fullName.toUpperCase().split(" ") || "";
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

        if (cardDiv instanceof HTMLCanvasElement) {
            cardDiv.toBlob((blob) => {
                saveAs(blob, userdata.idNumber + ".jpg");
            });
        }
    }

    async componentDidMount() {
        let users = Object.values(this.props.users);

        const sorted = users.sort((a, b) => {
            var nameA = a.fullName.split(" ")[0].toLowerCase();
            var nameB = b.fullName.split(" ")[0].toLowerCase();

            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;

            return 0;
        })

        sorted.map(async (u) => {
            this.setState({
                users: sorted
            });
        })
    }

    render() {
        return (
            <div className="d-content">
                <canvas id="qr-div" width={256} height={256} className="d-qr-canvas" style={{ display: "none" }} />
                <canvas id="card-div" className="d-card-canvas" style={{ display: "none" }} />

                <div className="d-scanner">
                    <table id="d-table" className="d-table">
                        <thead className="d-table-head">
                            <tr className="d-table-row">
                                <th className="d-table-column">Full Name</th>
                                <th className="d-table-column">ID Number</th>
                                <th className="d-table-column">Ward Number</th>
                                <th className="d-table-column">Address</th>
                                <th className="d-table-column">Phone Number</th>
                            </tr>
                        </thead>

                        {this.state.users.map(u =>
                            <tbody key={u.idNumber} className="d-table-body">
                                <tr className="d-table-row">
                                    <td className="d-table-column">{u.fullName}</td>
                                    <td className="d-table-column">{u.idNumber}</td>
                                    <td className="d-table-column">{u.wardNumber}</td>
                                    <td className="d-table-column">{u.address}</td>
                                    <td className="d-table-column">{u.phoneNumber}</td>
                                    <td className="d-table-column d-btn d-btn-primary" onClick={this.exportUser.bind(this, u)}>Export User</td>
                                </tr>
                            </tbody>)}
                    </table>

                    <div className="d-row">
                        <div className="d-btn d-btn-primary" onClick={this.exportToExcel.bind(this)}>Export Data</div>
                        <Link to="/" className="d-btn d-btn-primary">Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserList;