(() => {
  "use strict";
  const reportSwitch = document.getElementById("ai-report-switch");
  const upgradeDialog = document.getElementById("upgrade-dialog");

  // Free users can inspect the upgrade path, but cannot enable AI Report.
  reportSwitch.addEventListener("click", () => upgradeDialog.showModal());
  upgradeDialog.addEventListener("click", event => {
    if (event.target !== upgradeDialog) return;
    const bounds = upgradeDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      upgradeDialog.close();
    }
  });
  upgradeDialog.addEventListener("close", () => reportSwitch.focus());
})();
