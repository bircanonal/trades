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
        glow: boolean
    }
}
*/

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
        if (entry == 'name') {
            item.tag.display.Name = `{"text":"${data.nbt.name}","italic":false}`;
        }

        // description
        if (entry == 'description') {
            item.tag.display.Lore = [`{"text":"${data.nbt.description}","italic":false,"color":"gray"}`];
        }

        // custom model id
        if (entry == 'model') {
            item.tag.CustomModelData = data.nbt.model;
        }

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
        if (entry == 'damage') {
            item.tag.Damage = data.nbt.damage;
        }

        // unbreakable
        if (entry == 'unbreakable') {
            item.tag.Unbreakable = data.nbt.unbreakable;
        }

        // player name
        if (entry == 'player_name') {
            item.tag.SkullOwner = data.nbt.player_name;
        }

        // glow
        if (entry == 'glow') {
            if (data.nbt.glow)
                item.tag.Enchantments.push({});
        }
    }

    return item;
}
