// StatiCrypt 3.5.4's template logic, trimmed to the gate's markup
// (layouts/proposals/gate.html): no show-password toggle, and a wrong password
// shows #staticrypt-error instead of alert(). publish.sh splices this into the
// gate's empty #staticrypt-script; StatiCrypt then fills the placeholder slots.
// Re-check against lib/password_template.html when bumping StatiCrypt.
const staticryptInitiator = /*[|js_staticrypt|]*/ 0;
const isRememberEnabled = /*[|is_remember_enabled|]*/ 0,
  staticryptConfig = /*[|staticrypt_config|]*/ 0;

const templateConfig = {
  rememberExpirationKey: "staticrypt_expiration",
  rememberPassphraseKey: "staticrypt_passphrase",
  replaceHtmlCallback: null,
  clearLocalStorageCallback: null,
};

const staticrypt = staticryptInitiator.init(staticryptConfig, templateConfig);

// Decrypt straight away if "remember me" saved a password; otherwise show the form.
window.onload = async function () {
  const { isSuccessful } = await staticrypt.handleDecryptOnLoad();
  if (!isSuccessful) {
    document.getElementById("staticrypt_loading").classList.add("hidden");
    document.getElementById("staticrypt_content").classList.remove("hidden");
    document.getElementById("staticrypt-password").focus();
    if (isRememberEnabled) {
      document.getElementById("staticrypt-remember-label").classList.remove("hidden");
    }
  }
};

document.getElementById("staticrypt-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const password = document.getElementById("staticrypt-password").value,
    isRememberChecked = document.getElementById("staticrypt-remember").checked;
  const { isSuccessful } = await staticrypt.handleDecryptionOfPage(password, isRememberChecked);
  if (!isSuccessful) {
    document.getElementById("staticrypt-error").classList.remove("hidden");
  }
});
