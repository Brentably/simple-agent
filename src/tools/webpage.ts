import axios from "axios";
import cheerio from "cheerio";

export async function read_webpage(input: string): Promise<string> {
  try {
      const response = await axios.get(input);
      const htmlContent = response.data;
      const $ = cheerio.load(htmlContent);
      const textContent = $("body").text();
      
      // Clean up the text content
      const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const cleanedText = lines.join('\n');
      console.log(cleanedText)
      return cleanedText;
      
  } catch (error: any) {
      return `Error while fetching and parsing web page: ${error.message}`
  }
}