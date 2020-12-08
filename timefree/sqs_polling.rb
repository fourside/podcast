require 'shellwords'
require 'aws-sdk'
require 'time'

url = ENV['SQS_URL']

sqs = Aws::SQS::Client.new(region: 'ap-northeast-1')

resp = sqs.receive_message(queue_url: url, max_number_of_messages: 10, wait_time_seconds: 20)

resp.messages.each do |m|
  body = JSON.parse(m.body)
  fromTime = body["fromTime"]
  duration = body["duration"]
  if is_future(fromTime, duration)
    return
  end
  stationId = body["stationId"]
  title = Shellwords.escape(body["title"])
  personality = Shellwords.escape(body["personality"])
  command = "./rec_radiko_ts.sh -s #{stationId} -f #{fromTime} -d #{duration} -T #{title} -a #{personality}"
  puts command
  spawend = spawn command
  sqs.delete_message(queue_url: url, receipt_handle: m.receipt_handle)
  Process.wait spawend
end

def is_future fromTime, duration
  from = Time.parse(fromTime)
  to = from + (duration.to_i * 60)
  to > Time.now
end
