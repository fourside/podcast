require 'aws-sdk'

url = ENV['SQS_URL']

sqs = Aws::SQS::Client.new(region: 'ap-northeast-1')

resp = sqs.receive_message(queue_url: url, max_number_of_messages: 10, wait_time_seconds: 20)

resp.messages.each do |m|
  body = JSON.parse(m.body)
  stationId = body["stationId"]
  fromTime = body["fromTime"]
  duration = body["duration"]
  title = body["title"]
  personality = body["personality"]
  command = "./rec_radiko_ts.sh -s #{stationId} -f #{fromTime} -d #{duration} -T #{title} -a #{personality}"
  puts command
  spawn command
  sqs.delete_message(queue_url: url, receipt_handle: m.receipt_handle)
end
