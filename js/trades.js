// trades generate


var data;

// import
function open_import_window() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','import_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="https://sky.plexion.dev/wall/mine.png"></div>
        <div class="header" style="text-align: center;"><h4>Import data</h4></div>
        <div class="info" style="text-align: center;">
            <p>Import villager trades data in <a href="https://github.com/plexiondev/trades/wiki/Creating-a-suitable-JSON-file">this format</a>.</p>
            <br>
            <textarea class="generic" type="text" id="input" placeholder="Enter input.." style="width: 420px; resize: vertical; height: 300px; min-height: 70px; max-height: 450px;"></textarea>
        </div>
        <div class="actions">
            <a role="button" class="button focus sheared small" onclick="import_data()"><span class="content">Import</span></a>
            <a role="button" class="button sheared small" onclick="exit_windows()"><span class="content">Cancel</span></a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
}

function import_data() {
    try {
        select(JSON.parse(document.getElementById('input').value));
        exit_windows();
    } catch(e) {
        notify('error','Invalid data provided, please try again.',false);
    }
}

// fill up select
function select(import_data) {
    data = import_data;

    for (let i in data.villagers) {
        let em_option = document.createElement('option');
        em_option.value = `${i}`;
        em_option.innerHTML = `${data.villagers[i].name} (${i})`;

        // append
        document.getElementById('trade').appendChild(em_option);
    }

    document.getElementById('action.generate').setAttribute('onclick','call_gen()');
    document.getElementById('action.generate').classList.remove('shine');
    document.getElementById('action.generate').innerHTML = `<span class="content">Generate</span>`;
}

function call_gen() {
    generate(document.getElementById('trade').value);
}


/**
 * generate output
 * @param {string} villager_id current villager id
 */
function generate(villager_id) {
    let this_villager = data.villagers[villager_id];

    // clear tables and output
    document.getElementById('output').innerHTML = '';
    document.getElementById('trades').innerHTML = '';

    // assign villager name
    let name = this_villager.name;
    // display name
    document.getElementById('attr.name').textContent = `${name}`;


    // assemble json
    var object = {display:{},EntityTag:{}};

    // spawn egg display (name)
    object.display = {Lore:[`{"text":"Name: ${name}","color":"gray","italic":false}`]};

    // active effects
    //object.EntityTag = {ActiveEffects:[]}
    //for (let i in active_effects) {
    //    object.EntityTag.ActiveEffects.push({Id:active_effects[i],Amplifier:255,Duration:99999,ShowParticles:0});
    //}

    // entity data
    object.EntityTag.CustomName = `{"text":"${name}"}`; // set villager name
    object.EntityTag.NoAI = 1; // remove AI (to remove 1.14 professions)
    object.EntityTag.Offers = {Recipes:[]}; // clear default offers


    // assign trades
    for (let trade in this_villager.trades) {
        // visual item
        let buy_item = this_villager.trades[trade].buy;
        let sell_item = this_villager.trades[trade].sell;

        // buy & sell data
        let items = {};
        items.buy = create_item(this_villager.trades[trade].buy);
        items.sell = create_item(this_villager.trades[trade].sell);

        // prevent trades from auto-locking
        // due to default mechanics
        items.priceMultipler = 0.0;
        items.maxUses = 2147483647;
        items.demand = 0;
        items.specialPrice = 0;

        // append to offers
        object.EntityTag.Offers.Recipes.push(items);


        // visually display enchant in preview
        /*let buy_enchant = '';
        let sell_enchant = '';
        // check for enchants
        if (buy_item.nbt.enchants.length > 0)
            buy_enchant = ' enchant';
        if (sell_item.nbt.enchants.length > 0)
            sell_enchant = ' enchant';

        // format enchants
        let format_buy_enchants = '';
        let format_sell_enchants = '';
        for (let enchant in buy_item.nbt.enchants)
            format_buy_enchants = `${format_buy_enchants}${buy_item.nbt.enchants[enchant].id.replaceAll('_',' ').toProperCase()} ${convertToRoman(buy_item.nbt.enchants[enchant].lvl)}<br>`;
        for (let enchant in sell_item.nbt.enchants)
            format_sell_enchants = `${format_sell_enchants}${sell_item.nbt.enchants[enchant].id.replaceAll('_',' ').toProperCase()} ${convertToRoman(sell_item.nbt.enchants[enchant].lvl)}<br>`;
        */

        // record
        let em_record = document.createElement('div');
        em_record.classList.add('trade');

        // buy item
        em_record.appendChild(create_visual_item(items.buy));
        // seperator
        let em_seperator = document.createElement('span');
        em_seperator.classList.add('joiner');
        em_record.appendChild(em_seperator);
        // sell item
        em_record.appendChild(create_visual_item(items.sell));

        // tooltips
        /*tippy(em_buy_item, {
            content: `
            <strong>${buy_item.custom_name}</strong><br>
            <span style="color: var(--text-main);">${buy_item.custom_description}</span>
            <br>
            <span style="color: var(--text-main);">${format_buy_enchants}</span><br>
            <span style="color: var(--text-alt);">${this_villager.trades[trade].buy.id}</span>
            `,
            followCursor: true,
            placement: 'bottom-start',
            allowHTML: true,
            arrow: false
        });
        tippy(em_sell_item, {
            content: `
            <strong>${sell_item.custom_name}</strong><br>
            <span style="color: var(--text-main);">${sell_item.custom_description}</span>
            <br>
            <span style="color: var(--text-main);">${format_sell_enchants}</span><br>
            <span style="color: var(--text-alt);">${this_villager.trades[trade].sell.id}</span>
            `,
            followCursor: true,
            placement: 'bottom-start',
            allowHTML: true,
            arrow: false
        });*/

        document.getElementById(`trades`).appendChild(em_record);
    }

    // display output
    let output = 'give @p villager_spawn_egg' + JSON.stringify(object);
    document.getElementById('output').innerHTML = output;
}


// copy
function copy() {
    var selector = document.getElementById('output');

    // write to clipboard
    navigator.clipboard.writeText(selector.textContent);
}


// sentence case
// https://stackoverflow.com/a/5574446
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// convert to roman numerals
// https://stackoverflow.com/a/41358305
function convertToRoman(num) {
    var roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    var str = '';

    for (var i of Object.keys(roman)) {
        var q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }

    return str;
}