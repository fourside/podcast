# encoding : utf-8
#
require 'rubygems'
require 'sinatra'
require 'haml'
require 'yaml'
require 'shotgun'
require 'time'

mp3_dir = File.dirname(__FILE__) + '/../public'
#set :public_folder, PUBLIC_DIR

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
  @ext = '.mp3'
  @mp3s = Dir.glob(mp3_dir + "/mp3/*#{@ext}").sort_by {|mp3| File::stat(mp3).mtime }
  @url = request.scheme + '://' + request.host + ':' + request.port.to_s
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
        %title #{File.basename(mp3, @ext)}
        %discription #{File.basename(mp3, @ext)}
        %enclosure{:url => @url + '/mp3/' + URI.escape(File.basename(mp3)), :type => "audio/mpeg", :length =>File::stat(mp3).size}
        %pubDate #{File::stat(mp3).mtime.rfc822}

