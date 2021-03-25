require 'shellwords'
require 'aws-sdk'
require 'time'

def is_future fromTime, duration
  from = Time.parse(fromTime)
  to = from + (duration.to_i * 60)
  to > Time.now
end

def process_queue_message message
  body = JSON.parse(message.body)
  fromTime = body["fromTime"]
  duration = body["duration"]
  if is_future(fromTime, duration)
    return false
  end
  stationId = body["stationId"]
  title = Shellwords.escape(body["title"])
  personality = Shellwords.escape(body["personality"])
  command = "./rec_radiko_ts.sh -s #{stationId} -f #{fromTime} -d #{duration} -T #{title} -a #{personality}"
  puts command
  spawend = spawn command
  Process.wait spawend
  return true
end

url = ENV['SQS_URL']
dead_letter_url = ENV['DEAD_LETTER_SQS_URL']

sqs = Aws::SQS::Client.new(region: 'ap-northeast-1')

resp = sqs.receive_message(queue_url: url, max_number_of_messages: 10, wait_time_seconds: 20)
resp.messages.each do |message|
  if process_queue_message message
    sqs.delete_message(queue_url: url, receipt_handle: message.receipt_handle)
  end
end

dead_resp = sqs.receive_message(queue_url: dead_letter_url, max_number_of_messages: 10, wait_time_seconds: 20)
dead_resp.messages.each do |message|
  if process_queue_message message
    sqs.delete_message(queue_url: dead_letter_url, receipt_handle: message.receipt_handle)
  end
end
