# encoding : utf-8
#
require 'rubygems'
require 'sinatra'
require 'haml'
require 'shotgun'
require 'time'

PUBLIC_DIR = File.dirname(__FILE__) + '/../public'
set :public_folder, PUBLIC_DIR

# todo
# basic auth
# sort by atime
get '/feed' do
  @mp3s = Dir.glob(PUBLIC_DIR + "/mp3/*.mp3")
  @url = request.scheme + '://' + request.host + ':' + request.port.to_s
  haml :feed
end

__END__

@@ feed
!!!XML utf-8
%rss{:version => "2.0", "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd"}
  %channel
    %description private podcast
    %title private podcast
    %pubDate #{Time.new.rfc822}
    - @mp3s.each do |mp3|
      %item
        %title #{File.basename(mp3, '.mp3')}
        %discription #{File.basename(mp3, '.mp3')}
        %enclosure{:url => @url + '/mp3/' + URI.escape(File.basename(mp3)), :type => "audio/mpeg", :length =>File::stat(mp3).size}
        %pubDate #{File::stat(mp3).mtime.rfc822}

