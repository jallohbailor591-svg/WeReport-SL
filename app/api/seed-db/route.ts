import { NextRequest, NextResponse } from "next/server";
import { createServerClient_ } from "@/lib/supabase-server";

// Publicly accessible seed route (protected only by secret query param)
// This avoids the middleware blocking /admin/* routes
const SEED_SECRET = "wereport-seed-2025";

const realIssues = [
    {
        title: "Connaught Hospital Oxygen Shortage",
        description: "Critical shortage of oxygen cylinders in the emergency ward at Connaught Hospital. Multiple patients in critical condition are at risk due to lack of supply.",
        category: "healthcare",
        severity: 3,
        status: "in-progress",
        location: "Freetown",
        coordinates: { lat: 8.484, lng: -13.234 },
        upvotes: 45,
        user_id: null,
        image_urls: []
    },
    {
        title: "Guma Dam Water Levels Critically Low",
        description: "Water levels at Guma Dam have dropped significantly, causing severe rationing across Western Area. Residents in Babadorie and Regent have had no water for 5 days.",
        category: "water-sanitation",
        severity: 3,
        status: "pending",
        location: "Regent",
        coordinates: { lat: 8.435, lng: -13.205 },
        upvotes: 82,
        user_id: null,
        image_urls: []
    },
    {
        title: "Blackout in Bo City for 3 Weeks",
        description: "Consistent power outage in Bo City center for over 3 weeks. Local businesses are suffering massive losses due to reliance on expensive generator fuel.",
        category: "electricity",
        severity: 2,
        status: "pending",
        location: "Bo",
        coordinates: { lat: 7.964, lng: -11.738 },
        upvotes: 112,
        user_id: null,
        image_urls: []
    },
    {
        title: "Dangerous Potholes on Bai Bureh Road",
        description: "Deep potholes near Ferry Junction on Bai Bureh Road causing severe traffic gridlock and damaging vehicles. Two accidents reported this week.",
        category: "roads",
        severity: 2,
        status: "pending",
        location: "Freetown - East End",
        coordinates: { lat: 8.471, lng: -13.202 },
        upvotes: 67,
        user_id: null,
        image_urls: []
    },
    {
        title: "Uncollected Garbage at King Jimmy Market",
        description: "Massive pile of rotting garbage at King Jimmy Market blocking the main walkway and causing unbearable stench. Health hazard for traders and buyers.",
        category: "waste-management",
        severity: 3,
        status: "pending",
        location: "Freetown",
        coordinates: { lat: 8.489, lng: -13.238 },
        upvotes: 34,
        user_id: null,
        image_urls: []
    },
    {
        title: "Flash Floods in Kroo Bay",
        description: "Heavy rains caused flash flooding in Kroo Bay slum community. 50 homes submerged, residents displaced and in need of emergency shelter.",
        category: "flooding",
        severity: 3,
        status: "in-progress",
        location: "Kroo Bay",
        coordinates: { lat: 8.488, lng: -13.236 },
        upvotes: 95,
        user_id: null,
        image_urls: []
    },
    {
        title: "Dilapidated Roof at Rural Primary School",
        description: "The roof of Methodist Primary School in Kabala is leaking severely, forcing classes to stop whenever it rains. Children's education is being disrupted.",
        category: "education",
        severity: 2,
        status: "pending",
        location: "Kabala",
        coordinates: { lat: 9.588, lng: -11.551 },
        upvotes: 28,
        user_id: null,
        image_urls: []
    },
    {
        title: "Report of Domestic Violence in Kenema",
        description: "Repeated reports of domestic violence in a compound near Hangha Road. Local police have been unresponsive to calls from neighbors.",
        category: "gender-violence",
        severity: 3,
        status: "pending",
        location: "Kenema",
        coordinates: { lat: 7.876, lng: -11.189 },
        upvotes: 15,
        user_id: null,
        image_urls: []
    },
    {
        title: "Rice Price Hike in Makeni Market",
        description: "Unjustified hike in the price of imported rice by local wholesalers in Makeni. A 50kg bag is now sold at unaffordable rates for daily earners.",
        category: "food-security",
        severity: 1,
        status: "pending",
        location: "Makeni",
        coordinates: { lat: 8.882, lng: -12.046 },
        upvotes: 56,
        user_id: null,
        image_urls: []
    },
    {
        title: "Youth Unemployment Protest Planned",
        description: "Local youths in Kono represent frustration over lack of mining jobs promised by local companies. Tensions causing unrest in Koidu town center.",
        category: "employment",
        severity: 2,
        status: "resolved",
        location: "Koidu",
        coordinates: { lat: 8.641, lng: -10.971 },
        upvotes: 41,
        user_id: null,
        image_urls: []
    },
    {
        title: "Street Lighting Failure in Lumley",
        description: "Solar street lights along Lumley Beach Road have not been working for months, increasing risk of muggings at night for pedestrians.",
        category: "urban-safety",
        severity: 1,
        status: "pending",
        location: "Aberdeen/Lumley",
        coordinates: { lat: 8.472, lng: -13.278 },
        upvotes: 22,
        user_id: null,
        image_urls: []
    },
    {
        title: "Illegal Timber Logging in Gola Forest",
        description: "Trucks seen transporting illegal timber from the edge of Gola Rainforest National Park. Community rangers asking for government intervention.",
        category: "environment",
        severity: 3,
        status: "pending",
        location: "Gola Forest",
        coordinates: { lat: 7.636, lng: -10.902 },
        upvotes: 60,
        user_id: null,
        image_urls: []
    },
    {
        title: "Bribe Demands at Checkpoint",
        description: "Police officers at Masiaka checkpoint demanding bribes from commercial drivers, causing long delays and increasing transport costs.",
        category: "corruption",
        severity: 2,
        status: "pending",
        location: "Masiaka",
        coordinates: { lat: 8.572, lng: -12.593 },
        upvotes: 89,
        user_id: null,
        image_urls: []
    },
    {
        title: "Lack of Ramps at New City Council Building",
        description: "The newly constructed annex of the City Council building has no wheelchair ramps, making it inaccessible for persons with disabilities.",
        category: "accessibility",
        severity: 1,
        status: "pending",
        location: "Freetown",
        coordinates: { lat: 8.484, lng: -13.229 },
        upvotes: 18,
        user_id: null,
        image_urls: []
    },
    {
        title: "Mudslide Risk at Hill Station",
        description: "Warning signs of potential mudslide behind recent unregulated construction at Hill Station. Soil erosion is visible after heavy rains.",
        category: "disaster",
        severity: 3,
        status: "pending",
        location: "Hill Station",
        coordinates: { lat: 8.455, lng: -13.245 },
        upvotes: 53,
        user_id: null,
        image_urls: []
    },
    {
        title: "Fire Outbreak at Susan's Bay",
        description: "Fire reported at Susan's Bay community. Fire force struggling to access the area due to narrow slum pathways. Urgent need for water trucks.",
        category: "fire",
        severity: 3,
        status: "resolved",
        location: "Susan's Bay",
        coordinates: { lat: 8.491, lng: -13.232 },
        upvotes: 104,
        user_id: null,
        image_urls: []
    },
    {
        title: "Overcrowding in Granville Brook",
        description: "Illegal structures expanding into the Granville Brook drainage channel, causing blockage and flooding risk for the entire Kissy area.",
        category: "housing",
        severity: 2,
        status: "pending",
        location: "Kissy",
        coordinates: { lat: 8.468, lng: -13.208 },
        upvotes: 27,
        user_id: null,
        image_urls: []
    },
    {
        title: "Okada Riders Blocking Wilkinson Road",
        description: "Chaos on Wilkinson Road as Okada riders have taken over two lanes during rush hour, causing danger to pedestrians and other motorists.",
        category: "transport",
        severity: 1,
        status: "pending",
        location: "Freetown",
        coordinates: { lat: 8.466, lng: -13.262 },
        upvotes: 39,
        user_id: null,
        image_urls: []
    },
    {
        title: "Open Sewage in Dwarzark",
        description: "Main sewage pipe burst in Dwarzark community, flowing directly into the stream used by residents for washing. High risk of cholera.",
        category: "sanitation",
        severity: 3,
        status: "pending",
        location: "Dwarzark",
        coordinates: { lat: 8.475, lng: -13.242 },
        upvotes: 76,
        user_id: null,
        image_urls: []
    },
    {
        title: "Dove Cut Market Congestion",
        description: "Vendors have spilled onto the main road at Dove Cut, completely blocking vehicle access and forcing pedestrians to walk in sewage water.",
        category: "public-order",
        severity: 2,
        status: "pending",
        location: "Dove Cut",
        coordinates: { lat: 8.487, lng: -13.224 },
        upvotes: 31,
        user_id: null,
        image_urls: []
    }
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");

        if (secret !== SEED_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createServerClient_();

        // 1. Get a fallback User ID
        let seedUserId = null;
        const { data: users } = await supabase.from("profiles").select("id").limit(1);

        if (users && users.length > 0) {
            seedUserId = users[0].id;
        }

        // 2. Prepare payload
        const issuesToInsert = realIssues.map(issue => ({
            ...issue,
            user_id: seedUserId,
            coordinates: JSON.stringify(issue.coordinates),
            description: `${issue.description}\n\n[Source: Real-Seed-2025]`
        }));

        // 3. Insert
        const { data, error } = await supabase
            .from("issues")
            .insert(issuesToInsert)
            .select();

        if (error) {
            console.error("Seeding error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${data.length} issues!`,
            data
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
