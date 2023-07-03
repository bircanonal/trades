function add_trade() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','add_trade_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="https://sky.plexion.dev/wall/mine.png" style="opacity: 0;"></div>
        <div class="header" style="text-align: center;"><h4>Add trade</h4></div>
        <div class="info" style="text-align: center;">
            <div class="big-inputs">
                <span class="big-input">
                    <label for="buy">Buy item</label>
                    <input name="buy" id="buy">
                </span>
                <span class="big-input amount">
                    <label for="buy_amount">Count</label>
                    <input name="buy_amount" id="buy_amount">
                </span>
                <span class="big-input">
                    <label for="buy_nbt">NBT</label>
                    <input name="buy_nbt" id="buy_nbt">
                </span>
            </div>
            <div class="big-inputs">
                <span class="big-input">
                    <label for="buyB">BuyB item</label>
                    <input name="buyB" id="buyB">
                </span>
                <span class="big-input amount">
                    <label for="buyB_amount">Count</label>
                    <input name="buyB_amount" id="buyB_amount">
                </span>
                <span class="big-input">
                    <label for="buyB_nbt">NBT</label>
                    <input name="buyB_nbt" id="buyB_nbt">
                </span>
            </div>
            <div class="big-inputs">
                <span class="big-input">
                    <label for="sell">Sell item</label>
                    <input name="sell" id="sell">
                </span>
                <span class="big-input amount">
                    <label for="sell_amount">Count</label>
                    <input name="sell_amount" id="sell_amount">
                </span>
                <span class="big-input">
                    <label for="sell_nbt">NBT</label>
                    <input name="sell_nbt" id="sell_nbt">
                </span>
            </div>
        </div>
        <div class="actions">
            <a role="button" class="button focus sheared small" onclick="finalise_trade()"><span class="content">Add</span></a>
            <a role="button" class="button sheared small" onclick="exit_windows()"><span class="content">Cancel</span></a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
}

function finalise_trade() {
    let entries = ['buy','buyB','sell'];
    let entries2 = ['','_amount','_nbt'];

    let trade_creating = {};
    for (let entry in entries)
        for (let entry2 in entries2)
            trade_creating[`${entries[entry]}${entries2[entry2]}`] = document.getElementById(`${entries[entry]}${entries2[entry2]}`).value;

    if (trade_creating.buy == '') {
        notify('error','Your trade is not complete.',false);
        return;
    }

    let new_trade = {};
    new_trade.buy = {
        id: trade_creating.buy,
        count: trade_creating.buy_amount,
        nbt: JSON.parse(trade_creating.buy_nbt)
    };
    if (trade_creating.buyB != '') new_trade.buyB = {
        id: trade_creating.buyB,
        count: trade_creating.buyB_amount,
        nbt: JSON.parse(trade_creating.buyB_nbt)
    };
    new_trade.sell = {
        id: trade_creating.sell,
        count: trade_creating.sell_amount,
        nbt: JSON.parse(trade_creating.sell_nbt)
    };

    data.villagers.villager.trades.push(new_trade);

    console.log(trade_creating);
    generate('villager');
    exit_windows();
}

function trade_actions(trade_id) {
    let em_actions = document.createElement('div');
    em_actions.classList.add('actions');
    em_actions.innerHTML = (`
    <button class="button delete" onclick="delete_trade(${trade_id})">
        del
    </button>
    `);

    return em_actions;
}