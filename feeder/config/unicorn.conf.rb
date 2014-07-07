
worker_processes 2
app_root = "~fourside/work/radio/feeder"
working_directory app_root

listen "#{app_root}/logs/unicorn.sock", :backlog => 1
listen 8080, :tcp_nopush => true

timeout 60 * 60 * 3

stderr_path File.expand_path("#{app_root}/logs/unicorn_err.log", File.dirname(__FILE__))
stdout_path File.expand_path("#{app_root}/logs/unicorn.log", File.dirname(__FILE__))
pid         File.expand_path("#{app_root}/logs/unicorn.pid", File.dirname(__FILE__))

preload_app true



