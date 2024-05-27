export async function twofaView()
{
    app = document.getElementById("app");
    app.innerHTML = `
    <div class="signin">
        <div class="form-container">
            <div class="form-header">
                <h2>OTP</h2>
            </div>
            <form id="signinForm">
                <div class="form-group">
                    <label for="username">otp</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter otp code">
                </div>
                <button id="mybtn" type="button" class="btn btn-primary btn-block" onclick="signIn()">Submit</button>
            </form>
        </div>
    </div>
    `;
}