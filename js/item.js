/*
{
    id: string,
    count: integer,
    nbt: {
        name: string,
        description: string,
        model: string,
        enchants: [],
        damage: integer,
        unbreakable: boolean,
        player_name: string,
        glow: boolean,
        can_place: [],
        can_destroy: [],
        hide_flags: []
    }
}
*/

let hide_flags = {
    'enchants': 1,
    'modifiers': 2,
    'unbreakable': 4,
    'can_destroy': 8,
    'can_place': 16,
    'misc': 32,
    'dyed': 64,
    'armour_trim': 128,
    'all': 255
}

/**
 * create item via object
 * @param {object} data kate item object
 * @returns minecraft item object
 */
function create_item(data) {
    let item = {
        id: data.id,
        Count: data.count,
        tag: {
            display: {},
            Enchantments: []
        },
        tag_unparsed: data.nbt
    };

    // nbt
    for (let entry in data.nbt) {
        // custom name
        if (entry == 'name')
            item.tag.display.Name = `{"text":"${data.nbt.name}","italic":false}`;

        // description
        if (entry == 'description')
            item.tag.display.Lore = [`{"text":"${data.nbt.description}","italic":false,"color":"gray"}`];

        // custom model id
        if (entry == 'model')
            item.tag.CustomModelData = data.nbt.model;

        // enchants
        if (entry == 'enchants') {
            for (let enchant in data.nbt.enchants) {
                item.tag.Enchantments.push({
                    id: data.nbt.enchants[enchant].id,
                    lvl: data.nbt.enchants[enchant].lvl
                });
            }
        }

        // damage
        if (entry == 'damage')
            item.tag.Damage = data.nbt.damage;

        // unbreakable
        if (entry == 'unbreakable')
            item.tag.Unbreakable = data.nbt.unbreakable;

        // player name
        if (entry == 'player_name')
            item.tag.SkullOwner = data.nbt.player_name;

        // glow
        if (entry == 'glow')
            if (data.nbt.glow)
                item.tag.Enchantments.push({});

        // can place/destroy
        if (entry == 'can_place')
            item.tag.CanPlaceOn = data.nbt.can_place;
        if (entry == 'can_destroy')
            item.tag.CanDestroy = data.nbt.can_destroy;

        // hide flags
        if (entry == 'hide_flags') {
            item.tag.HideFlags = 0;
            for (let flag in data.nbt.hide_flags)
                item.tag.HideFlags += hide_flags[data.nbt.hide_flags[flag]];
        }
    }

    return item;
}
