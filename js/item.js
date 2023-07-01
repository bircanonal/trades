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
        player_name: string
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
        count: data.count,
        nbt: {
            display: {},
            Enchantments: []
        }
    };

    // nbt
    for (let entry in data.nbt) {
        // custom name
        if (entry == 'name') {
            item.nbt.display.Name = `{"text":"${data.nbt.name}","italic":false}`;
        }

        // description
        if (entry == 'description') {
            item.nbt.display.Lore = [`{"text":"${data.nbt.description}","italic":false,"color":"gray"}`];
        }

        // custom model id
        if (entry == 'model') {
            item.nbt.CustomModelData = data.nbt.model;
        }

        // enchants
        if (entry == 'enchants') {
            for (let enchant in data.nbt.enchants) {
                item.nbt.Enchantments.push({
                    id: 'minecraft' + data.nbt.enchants[enchant].id,
                    lvl: data.nbt.enchants[enchant].lvl
                });
            }
        }

        // damage
        if (entry == 'damage') {
            item.nbt.Damage = data.nbt.damage;
        }

        // unbreakable
        if (entry == 'unbreakable') {
            item.nbt.Unbreakable = data.nbt.unbreakable;
        }

        // player name
        if (entry == 'player_name') {
            item.nbt.SkullOwner = data.nbt.player_name;
        }
    }

    return item;
}