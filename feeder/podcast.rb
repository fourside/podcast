# encoding : utf-8
#
require 'rubygems'
require 'sinatra'
require 'haml'
require 'yaml'
require './mp3file'

mp3_dir = '/public'

helpers do

  def protect!
    unless authorized?
      response['WWW-Authenticate'] = %(Basic realm="private podcast")
      throw(:halt, [401, "Not Authoried"])
    end
  end

  def authorized?
    @auth ||= Rack::Auth::Basic::Request.new(request.env)
    auth = YAML.load_file(File.dirname(__FILE__) + '/config/auth.yml')
    @auth.provided? && @auth.basic? && @auth.credentials && @auth.credentials == [auth['user'], auth['password']]
  end

end

get '/feed' do
  protect!
  @mp3s = Dir.glob(mp3_dir + "/*#{Mp3File::EXT}").map{|file| Mp3File.new file }.sort
  @url = request.scheme + '://' + request.host + '/mp3/'
  content_type "application/xml"
  haml :feed
end

error do
  "server internal error."
end

__END__

@@ feed
!!! XML utf-8
%rss{:version => "2.0", "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd"}
  %channel
    %description private podcast
    %title private podcast
    %pubDate #{Time.new.rfc822}
    - @mp3s.each do |mp3|
      %item
        %title #{mp3.basename}
        %discription #{mp3.basename}
        %enclosure{:url => @url + mp3.url_path, :type => "audio/mpeg", :length => mp3.size}
        %pubDate #{mp3.mtime}

