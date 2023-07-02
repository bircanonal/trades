function create_visual_item(item) {
    let em_item = document.createElement('span');
    em_item.classList.add('item');
    em_item.innerHTML = (`
    <span class="icon">
        <img src="https://res.plexion.dev/minecraft/item/${item.id.replace('minecraft:','')}.png">
        <label class="count">${item.Count}</label>
    </span>
    <!--<span class="info">
        <p>${item.id}</p>
    </span>-->
    `);

    tippy(em_item, {
        content: `
        <strong>${item.id}</strong><br>
        <p>${JSON.stringify(item.tag_unparsed)}</p>
        `,
        followCursor: true,
        placement: 'bottom-start',
        allowHTML: true,
        arrow: false
    })

    return em_item;
}
