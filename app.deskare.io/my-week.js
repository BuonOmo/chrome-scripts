// @include _scripts/wait-for.js

/**
 * Auto-click the deskare save button for _my week_ updates.
 */
(async function () {
    await waitFor(".bg-red-100") // Make sure we’ve loaded once at least.
    const saveButton =  Array.
        from(document.querySelectorAll('button')).
        find((e) => e.textContent.includes("Save"))
    while (1) {
        const el = await waitFor('.bg-red-100')

        if (!el.textContent.includes("This week is not fully validated, don't forget to click on 'Save'")) continue

        saveButton.click()
        await sleep(1000) // Just chill
    }
})() 