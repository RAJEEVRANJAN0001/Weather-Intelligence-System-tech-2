const express = require('express');
const WeatherRequest = require('../models/WeatherRequest');
const { Parser } = require('json2csv');
const convert = require('xml-js');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Export single weather request by ID
router.get('/single', async (req, res) => {
  try {
    const { format = 'json', id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Weather request ID is required' });
    }

    const weatherRequest = await WeatherRequest.findById(id).lean();
    
    if (!weatherRequest) {
      return res.status(404).json({ error: 'Weather request not found' });
    }

    const weatherRequests = [weatherRequest]; // Wrap in array to reuse the same formatting logic

    switch (format.toLowerCase()) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=weather-${weatherRequest.resolved_location.city}-${Date.now()}.json`);
        return res.json(weatherRequest);

      case 'csv':
        const flattenedData = {
          id: weatherRequest._id,
          location_query: weatherRequest.location_query,
          city: weatherRequest.resolved_location.city,
          country: weatherRequest.resolved_location.country,
          lat: weatherRequest.resolved_location.lat,
          lon: weatherRequest.resolved_location.lon,
          start_date: weatherRequest.date_range.start_date,
          end_date: weatherRequest.date_range.end_date,
          temperature: weatherRequest.weather_summary?.temperature,
          temp_min: weatherRequest.weather_summary?.temp_min,
          temp_max: weatherRequest.weather_summary?.temp_max,
          humidity: weatherRequest.weather_summary?.humidity,
          wind_speed: weatherRequest.weather_summary?.wind_speed,
          conditions: weatherRequest.weather_summary?.conditions,
          precipitation: weatherRequest.weather_summary?.precipitation,
          aqi: weatherRequest.external_metadata?.air_quality?.aqi,
          quality_level: weatherRequest.external_metadata?.air_quality?.quality_level,
          email: weatherRequest.user_email,
          email_sent: weatherRequest.email_sent,
          created_at: weatherRequest.created_at
        };

        const parser = new Parser();
        const csv = parser.parse([flattenedData]);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=weather-${weatherRequest.resolved_location.city}-${Date.now()}.csv`);
        return res.send(csv);

      case 'xml':
        const xmlData = convert.json2xml(JSON.stringify({ weatherRequest }), {
          compact: true,
          spaces: 2
        });
        
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', `attachment; filename=weather-${weatherRequest.resolved_location.city}-${Date.now()}.xml`);
        return res.send(xmlData);

      case 'pdf':
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=weather-${weatherRequest.resolved_location.city}-${Date.now()}.pdf`);
        
        doc.pipe(res);
        
        // PDF Header
        doc.fontSize(24).text('Weather Intelligence Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Location Header
        doc.fontSize(20).fillColor('#2563eb').text(`${weatherRequest.resolved_location.city}, ${weatherRequest.resolved_location.country}`);
        doc.moveDown();
        
        // Basic Info
        doc.fontSize(12).fillColor('#000000');
        doc.text(`Query: ${weatherRequest.location_query}`);
        doc.text(`Coordinates: ${weatherRequest.resolved_location.lat.toFixed(4)}, ${weatherRequest.resolved_location.lon.toFixed(4)}`);
        doc.text(`Date Range: ${new Date(weatherRequest.date_range.start_date).toLocaleDateString()} - ${new Date(weatherRequest.date_range.end_date).toLocaleDateString()}`);
        doc.moveDown();
        
        // Weather Summary
        if (weatherRequest.weather_summary) {
          doc.fontSize(16).fillColor('#7c3aed').text('Weather Summary');
          doc.moveDown(0.5);
          doc.fontSize(11).fillColor('#000000');
          doc.text(`Temperature: ${weatherRequest.weather_summary.temperature}°C (Min: ${weatherRequest.weather_summary.temp_min}°C, Max: ${weatherRequest.weather_summary.temp_max}°C)`);
          doc.text(`Conditions: ${weatherRequest.weather_summary.conditions}`);
          doc.text(`Description: ${weatherRequest.weather_summary.description || 'N/A'}`);
          doc.text(`Humidity: ${weatherRequest.weather_summary.humidity}%`);
          doc.text(`Wind Speed: ${weatherRequest.weather_summary.wind_speed} km/h`);
          doc.text(`Precipitation: ${weatherRequest.weather_summary.precipitation || 0} mm`);
          doc.text(`Cloud Cover: ${weatherRequest.weather_summary.cloud_cover || 0}%`);
          doc.text(`UV Index: ${weatherRequest.weather_summary.uv_index || 'N/A'}`);
          doc.text(`Visibility: ${weatherRequest.weather_summary.visibility || 'N/A'} km`);
          doc.moveDown();
        }
        
        // Air Quality
        if (weatherRequest.external_metadata?.air_quality) {
          doc.fontSize(16).fillColor('#059669').text('Air Quality Index');
          doc.moveDown(0.5);
          doc.fontSize(11).fillColor('#000000');
          const aq = weatherRequest.external_metadata.air_quality;
          doc.text(`AQI: ${aq.aqi} - ${aq.quality_level}`);
          doc.text(`PM2.5: ${aq.pm25} µg/m³`);
          doc.text(`PM10: ${aq.pm10} µg/m³`);
          doc.text(`O3: ${aq.o3} µg/m³`);
          doc.text(`NO2: ${aq.no2} µg/m³`);
          doc.moveDown();
        }

        // Daily Forecast
        if (weatherRequest.weather_summary?.daily_forecast) {
          doc.addPage();
          doc.fontSize(18).fillColor('#2563eb').text('10-Day Forecast');
          doc.moveDown();
          
          weatherRequest.weather_summary.daily_forecast.forEach((day, index) => {
            doc.fontSize(11).fillColor('#000000');
            doc.text(`Day ${index + 1} - ${new Date(day.date).toLocaleDateString()}`);
            doc.text(`  Temp: ${day.temp_min}°C - ${day.temp_max}°C`);
            doc.text(`  Conditions: ${day.conditions}`);
            doc.text(`  Precipitation: ${day.precipitation} mm`);
            doc.moveDown(0.3);
          });
        }

        doc.end();
        return;

      case 'md':
      case 'markdown':
        let markdown = '# Weather Intelligence Report\n\n';
        markdown += `**Location:** ${weatherRequest.resolved_location.city}, ${weatherRequest.resolved_location.country}\n\n`;
        markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
        markdown += `**Query:** ${weatherRequest.location_query}\n\n`;
        markdown += `**Coordinates:** ${weatherRequest.resolved_location.lat.toFixed(4)}, ${weatherRequest.resolved_location.lon.toFixed(4)}\n\n`;
        markdown += `**Date Range:** ${new Date(weatherRequest.date_range.start_date).toLocaleDateString()} - ${new Date(weatherRequest.date_range.end_date).toLocaleDateString()}\n\n`;
        markdown += '---\n\n';
        
        if (weatherRequest.weather_summary) {
          markdown += '## Weather Summary\n\n';
          markdown += `- **Temperature:** ${weatherRequest.weather_summary.temperature}°C\n`;
          markdown += `- **Min/Max:** ${weatherRequest.weather_summary.temp_min}°C / ${weatherRequest.weather_summary.temp_max}°C\n`;
          markdown += `- **Conditions:** ${weatherRequest.weather_summary.conditions}\n`;
          markdown += `- **Humidity:** ${weatherRequest.weather_summary.humidity}%\n`;
          markdown += `- **Wind Speed:** ${weatherRequest.weather_summary.wind_speed} km/h\n`;
          markdown += `- **Precipitation:** ${weatherRequest.weather_summary.precipitation || 0} mm\n\n`;
        }
        
        if (weatherRequest.external_metadata?.air_quality) {
          markdown += '## Air Quality\n\n';
          const aq = weatherRequest.external_metadata.air_quality;
          markdown += `- **AQI:** ${aq.aqi} (${aq.quality_level})\n`;
          markdown += `- **PM2.5:** ${aq.pm25} µg/m³\n`;
          markdown += `- **PM10:** ${aq.pm10} µg/m³\n\n`;
        }

        if (weatherRequest.weather_summary?.daily_forecast) {
          markdown += '## 10-Day Forecast\n\n';
          markdown += '| Date | Min | Max | Conditions | Precipitation |\n';
          markdown += '|------|-----|-----|------------|---------------|\n';
          weatherRequest.weather_summary.daily_forecast.forEach(day => {
            markdown += `| ${new Date(day.date).toLocaleDateString()} | ${day.temp_min}°C | ${day.temp_max}°C | ${day.conditions} | ${day.precipitation}mm |\n`;
          });
        }

        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename=weather-${weatherRequest.resolved_location.city}-${Date.now()}.md`);
        return res.send(markdown);

      default:
        return res.status(400).json({ error: 'Invalid format. Supported: json, csv, xml, pdf, md' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export weather data in multiple formats
router.get('/', async (req, res) => {
  try {
    const { format = 'json', city, country } = req.query;

    const query = {};
    if (city) query['resolved_location.city'] = new RegExp(city, 'i');
    if (country) query['resolved_location.country'] = new RegExp(country, 'i');

    const weatherRequests = await WeatherRequest.find(query).lean();

    switch (format.toLowerCase()) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.json');
        return res.json(weatherRequests);

      case 'csv':
        const flattenedData = weatherRequests.map(req => ({
          id: req._id,
          location_query: req.location_query,
          city: req.resolved_location.city,
          country: req.resolved_location.country,
          lat: req.resolved_location.lat,
          lon: req.resolved_location.lon,
          start_date: req.date_range.start_date,
          end_date: req.date_range.end_date,
          temperature: req.weather_summary?.temperature,
          humidity: req.weather_summary?.humidity,
          wind_speed: req.weather_summary?.wind_speed,
          conditions: req.weather_summary?.conditions,
          aqi: req.external_metadata?.air_quality?.aqi,
          email: req.user_email,
          email_sent: req.email_sent,
          created_at: req.created_at
        }));

        const parser = new Parser();
        const csv = parser.parse(flattenedData);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.csv');
        return res.send(csv);

      case 'xml':
        const xmlData = convert.json2xml(JSON.stringify({ weatherRequests }), {
          compact: true,
          spaces: 2
        });
        
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.xml');
        return res.send(xmlData);

      case 'pdf':
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.pdf');
        
        doc.pipe(res);
        
        // PDF Header
        doc.fontSize(24).text('Weather Intelligence Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // PDF Content
        weatherRequests.forEach((request, index) => {
          if (index > 0) doc.addPage();
          
          doc.fontSize(18).text(`${request.resolved_location.city}, ${request.resolved_location.country}`);
          doc.moveDown();
          
          doc.fontSize(12);
          doc.text(`Query: ${request.location_query}`);
          doc.text(`Date Range: ${new Date(request.date_range.start_date).toLocaleDateString()} - ${new Date(request.date_range.end_date).toLocaleDateString()}`);
          doc.moveDown();
          
          if (request.weather_summary) {
            doc.fontSize(14).text('Weather Summary:');
            doc.fontSize(11);
            doc.text(`Temperature: ${request.weather_summary.temperature}°C`);
            doc.text(`Conditions: ${request.weather_summary.conditions}`);
            doc.text(`Humidity: ${request.weather_summary.humidity}%`);
            doc.text(`Wind Speed: ${request.weather_summary.wind_speed} km/h`);
          }
          
          doc.moveDown();
          if (request.external_metadata?.air_quality) {
            doc.fontSize(14).text('Air Quality:');
            doc.fontSize(11);
            doc.text(`AQI: ${request.external_metadata.air_quality.aqi} (${request.external_metadata.air_quality.quality_level})`);
          }
        });

        doc.end();
        return;

      case 'md':
      case 'markdown':
        let markdown = '# Weather Intelligence Report\n\n';
        markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
        markdown += '---\n\n';

        weatherRequests.forEach(request => {
          markdown += `## ${request.resolved_location.city}, ${request.resolved_location.country}\n\n`;
          markdown += `**Location Query:** ${request.location_query}\n\n`;
          markdown += `**Date Range:** ${new Date(request.date_range.start_date).toLocaleDateString()} - ${new Date(request.date_range.end_date).toLocaleDateString()}\n\n`;
          
          if (request.weather_summary) {
            markdown += '### Weather Summary\n\n';
            markdown += `- **Temperature:** ${request.weather_summary.temperature}°C\n`;
            markdown += `- **Conditions:** ${request.weather_summary.conditions}\n`;
            markdown += `- **Humidity:** ${request.weather_summary.humidity}%\n`;
            markdown += `- **Wind Speed:** ${request.weather_summary.wind_speed} km/h\n\n`;
          }
          
          if (request.external_metadata?.air_quality) {
            markdown += '### Air Quality\n\n';
            markdown += `- **AQI:** ${request.external_metadata.air_quality.aqi}\n`;
            markdown += `- **Quality Level:** ${request.external_metadata.air_quality.quality_level}\n\n`;
          }
          
          markdown += '---\n\n';
        });

        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', 'attachment; filename=weather-data.md');
        return res.send(markdown);

      default:
        return res.status(400).json({ error: 'Invalid format. Supported: json, csv, xml, pdf, md' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
