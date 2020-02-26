export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        text: DataTypes.STRING
    });

    Message.associate = models => {
        Message.belongsTo(models.User, {
            foreignkey: 'userId'
        });
        Message.belongsTo(models.Channel, {
            foreignkey: 'channelId'
        });
    };

    return Message;
}