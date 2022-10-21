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
            <textarea class="generic" type="text" id="input" placeholder="Enter input.." style="width: 420px; height: 200px;"></textarea>
        </div>
        <div class="actions">
            <a role="button" class="button focus sheared small" onclick="import_data()"><span class="content">Import</span></a>
            <a role="button" class="button sheared small" onclick="exit_windows()"><span class="content">Cancel</span></a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    feather.replace();
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

    for (let i in data.trades) {
        let em_option = document.createElement('option');
        em_option.value = `${data.trades[i].id}`;
        em_option.innerHTML = `${data.trades[i].name} (${data.trades[i].id})`;

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
    // clear tables and output
    document.getElementById('output').innerHTML = '';
    document.getElementById('table-body').innerHTML = (`
    <tr>
        <th></th>
        <th>Name</th>
        <th class="arrow-get"></th>
        <th></th>
        <th>Name</th>
        <th></th>
    </tr>
    `);

    // assign villager name
    let name;
    for (let i in data.trades)
        if (data.trades[i].id == villager_id)
            name = data.trades[i].name;
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
    for (let trade in data) {
        // 'trades' is reserved for assigning villagers
        // this is by default skipped, but a better
        // alternative will arrive in the future
        if (trade != 'trades') {
            for (let i in data[trade]) {
                // ensure assigned to 'villager_id'
                // this will also be replaced by a better
                // alternative in the future
                let has_matched_villager = false;
                for (let t in data[trade][i].trades)
                    if (data[trade][i].trades[t] == villager_id)
                        has_matched_villager = true;

                // continue
                if (has_matched_villager) {
                    // process item
                    let buy_data = nbt('buy',{},{},trade,i);
                    let sell_data = nbt('sell',{},{},trade,i);

                    // NBT
                    let buy_nbt = buy_data.nbt;
                    let sell_nbt = sell_data.nbt;

                    // visual item
                    let buy_item = buy_data.item;
                    let sell_item = sell_data.item;

                    // buy & sell data
                    let items = {};

                    // buy item
                    items.buy = {
                        id: data[trade][i].buy.id,
                        Count: data[trade][i].buy.count,
                        tag: buy_nbt
                    };

                    // sell item
                    items.sell = {
                        id: data[trade][i].sell.id,
                        Count: data[trade][i].sell.count,
                        tag: sell_nbt
                    };

                    // prevent trades from auto-locking
                    // due to default mechanics
                    items.priceMultipler = 0.0;
                    items.maxUses = 2147483647;
                    items.demand = 0;
                    items.specialPrice = 0;

                    // append to offers
                    object.EntityTag.Offers.Recipes.push(items);


                    // visually display enchant in preview
                    let buy_enchant = '';
                    let sell_enchant = '';
                    // check for enchants
                    if (buy_item.enchants.length > 0)
                        buy_enchant = ' enchant';
                    if (sell_item.enchants.length > 0)
                        sell_enchant = ' enchant';

                    // format enchants
                    let format_buy_enchants = '';
                    let format_sell_enchants = '';
                    for (let enchant in buy_item.enchants)
                        format_buy_enchants = `${format_buy_enchants}${buy_item.enchants[enchant].id.replaceAll('_',' ').toProperCase()} ${convertToRoman(buy_item.enchants[enchant].lvl)}<br>`;
                    for (let enchant in sell_item.enchants)
                        format_sell_enchants = `${format_sell_enchants}${sell_item.enchants[enchant].id.replaceAll('_',' ').toProperCase()} ${convertToRoman(sell_item.enchants[enchant].lvl)}<br>`;


                    // record
                    let em_record = document.createElement('tr');

                    // buy item
                    let em_buy_icon = document.createElement('th');
                    em_buy_icon.classList.add('icon');
                    em_buy_icon.innerHTML = `<div class="headline-icon min" style="padding: 0; height: auto; position: relative; top: 10px;"><img src="https://plexion.dev/img/item/${data[trade][i].buy.id}.png"></div>`;
                    em_record.appendChild(em_buy_icon);
                    let em_buy_item = document.createElement('th');
                    em_buy_item.classList.add('name');
                    em_buy_item.innerHTML = `${buy_item.custom_name}<label class="count">${data[trade][i].buy.count}</label>`;
                    em_record.appendChild(em_buy_item);
                    // seperator
                    let em_seperator = document.createElement('th');
                    em_seperator.classList.add('arrow-get');
                    em_seperator.innerHTMl = '<i class="icon w-24" data-feather="arrow-right"></i>';
                    em_record.appendChild(em_seperator);
                    // sell item
                    let em_sell_icon = document.createElement('th');
                    em_sell_icon.classList.add('icon');
                    em_sell_icon.innerHTML = `<div class="headline-icon min" style="padding: 0; height: auto; position: relative; top: 10px;"><img src="https://plexion.dev/img/item/${data[trade][i].sell.id}.png"></div>`;
                    em_record.appendChild(em_sell_icon);
                    let em_sell_item = document.createElement('th');
                    em_sell_item.classList.add('name');
                    em_sell_item.innerHTML = `${sell_item.custom_name}<label class="count">${data[trade][i].sell.count}</label>`;
                    em_record.appendChild(em_sell_item);

                    // tooltips
                    tippy(em_buy_item, {
                        content: `
                        <strong>${buy_item.custom_name}</strong><br>
                        <span style="color: var(--text-main);">${buy_item.custom_description}</span>
                        <br>
                        <span style="color: var(--text-main);">${format_buy_enchants}</span><br>
                        <span style="color: var(--text-alt);">minecraft:${data[trade][i].buy.id}</span>
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
                        <span style="color: var(--text-alt);">minecraft:${data[trade][i].sell.id}</span>
                        `,
                        followCursor: true,
                        placement: 'bottom-start',
                        allowHTML: true,
                        arrow: false
                    });

                    document.getElementById(`table-body`).appendChild(em_record);
                }
                feather.replace();
            }
        }
    }

    // display output
    let output = `give @p villager_spawn_egg${JSON.stringify(object)}`;
    document.getElementById('output').innerHTML = `${output}`;
}

/**
 * 
 * @param {string} type buy/sell
 * @param {object} nbt NBT
 * @param {object} item item
 * @param {string} trade trade id
 * @param {string} i loop index
 * @returns final nbt and item objects
 */
function nbt(type,nbt,item,trade,i) {
    let current_trade = data[trade][i][`${type}`];

    // default values
    item = {
        'custom_name': current_trade.id,
        'custom_description': '',
        'custom_model': '',
        'enchants': [],
        'damage': '',
        'unbreakable': 0,
        'player_name': ''
    }

    for (let entry in current_trade.nbt) {
        if (entry == 'name') {
            if (typeof nbt.display == 'undefined')
                nbt.display = {};

            item.custom_name = current_trade.nbt.name;
            nbt.display.Name = `{"text":"${current_trade.nbt.name}","italic":false}`;
        } else if (entry == 'description') {
            if (typeof nbt.display == 'undefined')
                nbt.display = {};

            item.custom_description = current_trade.nbt.description;
            nbt.display.Lore = [`{"text":"${current_trade.nbt.description}","italic":false,"color":"gray"}`];
        } else if (entry == 'model') {
            item.custom_model = current_trade.nbt.model;
            nbt.CustomModelData = current_trade.nbt.model;
        } else if (entry == 'enchants') {
            if (typeof nbt.Enchantments == 'undefined')
                nbt.Enchantments = [];

            item.item_enchants = current_trade.nbt.enchants;
            for (let enchant in current_trade.nbt.enchants)
                nbt.Enchantments.push({
                    id:`minecraft:${current_trade.nbt.enchants[enchant].id}`,
                    lvl:current_trade.nbt.enchants[enchant].lvl});
        } else if (entry == 'damage') {
            item.damage = current_trade.nbt.damage;
            nbt.Damage = current_trade.nbt.damage;
        } else if (entry == 'unbreakable') {
            item.unbreakable = current_trade.nbt.unbreakable;
            nbt.Unbreakable = current_trade.nbt.unbreakable;
        } else if (entry == 'player_name') {
            item.player_name = current_trade.nbt.player_name;
            nbt.SkullOwner = current_trade.nbt.player_name;
        }
    }

    return {'nbt': nbt, 'item': item};
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