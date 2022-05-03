import Store from "@/store/store"

var mapper = (item1s, item2s, comparer, propName, def = {}) => {
    item1s.forEach(a => {
        var item2 = item2s.find(e => {
            return comparer(a, e);
        })

        if (item2 === null || item2 === undefined) {
            item2 = def
        }
        a[propName] = item2;
    })
}

var currUserId = Store.state.loginData.username;




var mapConversationToDisplayedUser = (item1s, item2s) => {
    var comparer = (a, b) => {
        var mem = a.members.find(e1 => e1.userId === currUserId)
        return mem.userDisplayedId === b.username;
    }

    mapper(item1s, item2s, comparer, "displayedUser")

}
var mapChatMessageToDisplayedUser = (item1s, item2s) => {
    var comparer = (a, b) => a.authorId === b.username;
    mapper(item1s, item2s, comparer, "displayedUser")

}
var mapConversationToLastMessage = (item1s, item2s) => {
    var comparer = (a, b) => a.conversationId === b.conversationId && a.lastMessageTime === b.lastMessageTime;
    mapper(item1s, item2s, comparer, "lastMessage")

}


export default {
    mapper,
    mapConversationToDisplayedUser,
    mapChatMessageToDisplayedUser,
    mapConversationToLastMessage
};