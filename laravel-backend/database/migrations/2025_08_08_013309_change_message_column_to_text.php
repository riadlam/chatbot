<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ChangeMessageColumnToText extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // First, create a temporary column to store the converted data
        Schema::table('bot_messages', function (Blueprint $table) {
            $table->text('message_text')->nullable()->after('message');
        });

        // Convert JSON data to text
        $messages = DB::table('bot_messages')->get();
        foreach ($messages as $message) {
            $messageContent = $message->message;
            
            // If message is JSON, extract the text
            if (is_string($messageContent)) {
                $decoded = json_decode($messageContent, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    if (isset($decoded['text'])) {
                        $messageContent = $decoded['text'];
                    } elseif (isset($decoded['message']['text'])) {
                        $messageContent = $decoded['message']['text'];
                    } else {
                        $messageContent = json_encode($decoded);
                    }
                }
            } elseif (is_array($messageContent)) {
                if (isset($messageContent['text'])) {
                    $messageContent = $messageContent['text'];
                } elseif (isset($messageContent['message']['text'])) {
                    $messageContent = $messageContent['message']['text'];
                } else {
                    $messageContent = json_encode($messageContent);
                }
            }
            
            // Update the temporary column
            DB::table('bot_messages')
                ->where('id', $message->id)
                ->update(['message_text' => $messageContent]);
        }

        // Remove the old column and rename the new one
        Schema::table('bot_messages', function (Blueprint $table) {
            $table->dropColumn('message');
        });

        Schema::table('bot_messages', function (Blueprint $table) {
            $table->renameColumn('message_text', 'message');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert the changes if needed
        Schema::table('bot_messages', function (Blueprint $table) {
            $table->json('message_json')->nullable()->after('message');
        });

        // Convert text back to JSON format
        $messages = DB::table('bot_messages')->get();
        foreach ($messages as $message) {
            DB::table('bot_messages')
                ->where('id', $message->id)
                ->update([
                    'message_json' => json_encode(['text' => $message->message])
                ]);
        }

        // Remove the old column and rename the new one
        Schema::table('bot_messages', function (Blueprint $table) {
            $table->dropColumn('message');
        });

        Schema::table('bot_messages', function (Blueprint $table) {
            $table->renameColumn('message_json', 'message');
        });
    }
}
