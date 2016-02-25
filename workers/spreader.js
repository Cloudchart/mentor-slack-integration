import { Channel } from '../models'
import { UserTheme } from '../models/web_app'


// Worker (sends insights to a channel)
//
export let perform = async (done) => {
  console.log('>>>', 'done');
  let channels = await Channel.findAll()
  let channelIds = channels.map(channel => channel.id)
  console.log(channelIds);
  done(null, true)
}
