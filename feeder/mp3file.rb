# encoding: utf-8

require 'time'

class Mp3File
  EXT = ".mp3"

  def initialize(filename)
    @name = filename
    @file = File.stat(filename)
  end

  def basename
    File.basename(@name, EXT)
  end

  def url_path
    URI.escape(self.basename)
  end

  def size
    @file.size
  end

  def mtime
    @file.mtime.rfc822
  end

  def <=>(other)
    self.mtime <=> other.mtime
  end
end

